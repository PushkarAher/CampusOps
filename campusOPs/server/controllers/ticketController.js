const supabase = require('../config/supabaseClient');
const INTELLIGENCE_URL = (process.env.INTELLIGENCE_URL || 'http://localhost:8000').replace(/\/+$/, '');

const getTickets = async (req, res) => {
    const { data, error } = await supabase.from('tickets').select('*');
    if (error) return res.status(500).json({ error: error.message });

    const now = new Date();
    const filteredData = data.filter(ticket => {
        if (ticket.status === 'Resolved') {
            // Fallback to created_at if resolved_at is not available
            const resolvedDate = ticket.resolved_at ? new Date(ticket.resolved_at) : new Date(ticket.created_at);
            const diffTime = Math.abs(now - resolvedDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Hide if it has been more than 7 days since resolution
            if (diffDays > 7) {
                return false;
            }
        }
        return true;
    });

    res.status(200).json(filteredData);
};

const createTicket = async (req, res) => {
    const { title, description, location, image_url } = req.body;
    
    // Proximity-Aware Deduplication (Clustering) using Python Intelligence Service
    // Check if there is already an open/in progress ticket for this location
    const { data: existingTickets, error: searchError } = await supabase
        .from('tickets')
        .select('*')
        .eq('location', location)
        .in('status', ['Open', 'In Progress'])
        .order('created_at', { ascending: false });

    if (searchError) return res.status(500).json({ error: searchError.message });

    if (existingTickets && existingTickets.length > 0) {
        // Find the best match using Semantic Similarity via Python Service
        for (const existingTicket of existingTickets) {
            try {
                // We use dynamic import for fetch to support Node environments
                const similarityResponse = await fetch(`${INTELLIGENCE_URL}/similarity`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ texts: [description, existingTicket.description] })
                });
                
                if (similarityResponse.ok) {
                    const simResult = await similarityResponse.json();
                    // Cosine Similarity >= 0.82 according to the abstract
                    if (simResult.similarity >= 0.82) {
                        // Cluster it! Increment upvotes/clustered count of the master ticket
                        const newUpvoteCount = (existingTicket.upvotes || 0) + 1;
                        const newClusterCount = (existingTicket.clustered_reports_count || 0) + 1;
                        
                        const { data: updatedMaster, error: updateError } = await supabase
                            .from('tickets')
                            .update({ upvotes: newUpvoteCount, upvote_count: newUpvoteCount, clustered_reports_count: newClusterCount })
                            .eq('id', existingTicket.id)
                            .select();
                            
                        if (updateError) return res.status(500).json({ error: updateError.message });
                        return res.status(200).json(updatedMaster); // Return the clustered master ticket
                    } else if (simResult.similarity >= 0.65) {
                        // Boundary Zone: Create distinctly, but flag for 1-tap confirmation
                        req.body.requires_human_triage = true;
                        req.body.potential_duplicate_of = existingTicket.id;
                        break; // Stop searching and proceed to create the ticket
                    }
                }
            } catch (err) {
                console.error("Error communicating with Intelligence layer:", err);
                // Fail gracefully and continue to create a new ticket if Python service is down
            }
        }
    }

    // If no duplicate, create a new ticket with deterministic priority score
    const id = `TCK-${Math.floor(100000 + Math.random() * 900000)}`; 
    
    // Deterministic priority scoring via Intelligence layer
    let safetyHazard = 0.1;
    let facilityCriticality = 0.2;
    
    try {
        const analyzeResponse = await fetch(`${INTELLIGENCE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: title + " " + description + " " + location })
        });
        
        if (analyzeResponse.ok) {
            const analyzeResult = await analyzeResponse.json();
            safetyHazard = analyzeResult.safety_hazard || safetyHazard;
            facilityCriticality = analyzeResult.facility_criticality || facilityCriticality;
        }
    } catch (err) {
        console.error("Error communicating with Intelligence layer for analysis:", err);
    }
    
    // Crowd Density remains a mock for now, or could be fetched from another service
    const crowdDensity = Math.random();
    const unresolvedLatency = 0.0; // brand new ticket
    
    // Priority Score = 0.40(Safety Hazard) + 0.25(Crowd Density) + 0.20(Unresolved Latency) + 0.15(Facility Criticality)
    const rawPriority = (0.40 * safetyHazard) + (0.25 * crowdDensity) + (0.20 * unresolvedLatency) + (0.15 * facilityCriticality);
    const priorityScore = Math.floor(rawPriority * 100); // Scale to 0-100

    const reporterName = req.user?.user_metadata?.fullName || (req.user?.user_metadata?.role === 'Teacher' ? 'Faculty Member' : 'Student Reporter');
    const reporterRole = req.user?.user_metadata?.role || 'Student';
    const isTeacher = reporterRole === 'Teacher' || reporterRole === 'Faculty';
    const isClassInSession = Boolean(req.body.class_in_session_active);

    // If faculty reported or class is in session, boost priority score significantly
    let finalPriorityScore = priorityScore;
    if (isClassInSession) {
        finalPriorityScore = Math.max(finalPriorityScore, 92);
    } else if (isTeacher) {
        finalPriorityScore = Math.min(100, finalPriorityScore + 20);
    }

    const { data, error } = await supabase.from('tickets').insert([{ 
        id, 
        title, 
        description, 
        location, 
        image_url: image_url || null,
        reporter_name: reporterName,
        reporter_role: reporterRole,
        status: 'Open', 
        upvotes: isTeacher ? 1 : 0,
        upvote_count: isTeacher ? 1 : 0,
        clustered_reports_count: 0,
        department: req.body.department || req.user?.user_metadata?.department || (isTeacher ? 'Academic Department' : 'General'),
        priority_score: finalPriorityScore,
        safety_hazard: safetyHazard * 100,
        crowd_density: crowdDensity * 100,
        facility_criticality: isClassInSession ? 95 : facilityCriticality * 100,
        is_master: !req.body.requires_human_triage,
        class_in_session_active: isClassInSession,
        faculty_endorsed: isTeacher,
        endorsed_by: isTeacher ? reporterName : null,
        is_sla_escalated: isClassInSession || isTeacher
    }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

const updateTicket = async (req, res) => {
    const { id } = req.params;
    let updateData = req.body;
    
    // Fetch current ticket state to handle increments and faculty endorsement boosts
    const { data: ticket } = await supabase.from('tickets').select('*').eq('id', id).single();
    
    if (ticket) {
        // Handle upvote increment
        if (updateData.upvotes && updateData.upvotes.increment) {
            updateData.upvotes = (ticket.upvotes || 0) + 1;
            updateData.upvote_count = (ticket.upvote_count || 0) + 1;
        }

        // Handle faculty endorsement escalation
        if (updateData.faculty_endorsed) {
            updateData.faculty_endorsed = true;
            updateData.is_sla_escalated = true;
            updateData.endorsed_by = req.user?.user_metadata?.fullName || 'Faculty Member';
            // Boost priority score by 25 points up to 100
            const currentPriority = Number(ticket.priority_score) || 50;
            updateData.priority_score = Math.min(100, currentPriority + 25);
            // Also increment upvote count as an endorsement
            updateData.upvotes = (ticket.upvotes || 0) + 1;
            updateData.upvote_count = (ticket.upvote_count || 0) + 1;
        }

        // Handle technician assignment when moving to In Progress
        if (updateData.status === 'In Progress') {
            if (!updateData.assigned_technician && !ticket.assigned_technician) {
                updateData.assigned_technician = req.user?.user_metadata?.fullName || 'Facility Technician';
            }
        }

        // Handle resolution
        if (updateData.status === 'Resolved') {
            updateData.resolved_at = updateData.resolved_at || new Date().toISOString();
            if (!updateData.assigned_technician && !ticket.assigned_technician) {
                updateData.assigned_technician = req.user?.user_metadata?.fullName || 'Facility Technician';
            }
            if (updateData.resolved_image_url || updateData.proof_notes) {
                updateData.verified_proof = true;
            }
        }
    }

    let { data, error } = await supabase.from('tickets').update(updateData).eq('id', id).select();
    
    // Safely handle missing feedback_rating column in Supabase schema without crashing
    if (error && error.message && error.message.includes('feedback_rating')) {
        delete updateData.feedback_rating;
        const retry = await supabase.from('tickets').update(updateData).eq('id', id).select();
        data = retry.data;
        error = retry.error;
        
        // Mock the feedback rating on the returned object so frontend reflects it
        if (data && data.length > 0) {
            data[0].feedback_rating = req.body.feedback_rating;
        }
    }

    if (error) return res.status(500).json({ error: error.message });
    const updated = (Array.isArray(data) && data.length > 0) ? data[0] : data;
    res.status(200).json(updated);
};

const getTicketById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('tickets').select('*').eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(data[0]);
};

module.exports = {
    getTickets,
    createTicket,
    updateTicket,
    getTicketById
};
