const supabase = require('../config/supabaseClient');

const getNotices = async (req, res) => {
    let { data: notices, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    
    // If table doesn't exist or error, just default to empty array
    let allNotices = notices || [];

    // Generate dynamic AI Insights from tickets
    const { data: tickets } = await supabase.from('tickets').select('*');
    
    if (tickets && tickets.length > 0) {
        // Insight 1: High priority unresolved issues
        const highPriority = tickets.filter(t => t.status !== 'Resolved' && t.priority_score > 75);
        if (highPriority.length > 0) {
            allNotices.push({
                id: 'ai-1',
                title: 'Critical Attention Required',
                content: `AI Triage has flagged ${highPriority.length} high-priority issue(s) that require immediate attention.`,
                type: 'ai',
                created_at: new Date().toISOString()
            });
        }
        
        // Insight 2: Clustered reports
        const clustered = tickets.filter(t => t.clustered_reports_count > 0);
        if (clustered.length > 0) {
            allNotices.push({
                id: 'ai-2',
                title: 'Anomaly Detected: High Report Volume',
                content: `AI has automatically clustered duplicate reports into ${clustered.length} master ticket(s). This indicates widespread impact for these issues.`,
                type: 'ai',
                created_at: new Date(Date.now() - 1000).toISOString() // Slightly offset to maintain sort order
            });
        }

        // Insight 3: Most problematic locations
        const locations = {};
        tickets.forEach(t => {
            if (t.status !== 'Resolved' && t.location) {
                locations[t.location] = (locations[t.location] || 0) + 1;
            }
        });
        const hotSpots = Object.entries(locations).filter(([loc, count]) => count >= 2);
        if (hotSpots.length > 0) {
            const spotList = hotSpots.map(h => `${h[0]} (${h[1]} issues)`).join(', ');
            allNotices.push({
                id: 'ai-3',
                title: 'Location Hotspots Identified',
                content: `AI predicts infrastructure stress in the following areas: ${spotList}. Preventative maintenance recommended.`,
                type: 'ai',
                created_at: new Date(Date.now() - 2000).toISOString()
            });
        }
        
        // Insight 4: Active Repairs
        const inProgress = tickets.filter(t => t.status === 'In Progress');
        if (inProgress.length > 0) {
            const repairList = inProgress.map(t => `${t.title} (${t.location})`).join(', ');
            allNotices.push({
                id: 'ai-5',
                title: 'Live Crew Tracking',
                content: `Technicians are currently on-site and actively repairing the following issues: ${repairList}.`,
                type: 'ai',
                created_at: new Date(Date.now() - 500).toISOString()
            });
        }
        
        // Insight 5: General system status if no alerts
        if (allNotices.filter(n => n.type === 'ai').length === 0) {
            allNotices.push({
                id: 'ai-4',
                title: 'System Optimal',
                content: 'AI monitoring indicates normal campus operations. No severe anomalies detected at this time.',
                type: 'ai',
                created_at: new Date().toISOString()
            });
        }
    } else {
        // Fallback AI notice if no tickets
         allNotices.push({
            id: 'ai-0',
            title: 'AI Monitoring Active',
            content: 'The autonomous triage system is active and monitoring for facility anomalies.',
            type: 'ai',
            created_at: new Date().toISOString()
        });
    }
    
    // Sort combined notices by date descending
    allNotices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json(allNotices);
};

const createNotice = async (req, res) => {
    const { title, content } = req.body;
    const { data, error } = await supabase.from('notices').insert([{ title, content, type: 'admin' }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};

module.exports = {
    getNotices,
    createNotice
};
