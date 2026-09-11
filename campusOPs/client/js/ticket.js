let currentTicket = null;
let selectedRating = 0;
let ratingEventsBound = false;

function _t(key, fallback = '') {
    return (typeof t === 'function') ? t(key, fallback) : fallback;
}

function renderTicketDetails(ticket) {
    if (!ticket) return;

    // Populate DOM elements
    const idDisplay = document.getElementById('ticketIdDisplay');
    const statusBadge = document.getElementById('ticketStatusBadge');
    const upvotesBadge = document.getElementById('ticketUpvotesBadge');
    const timeDisplay = document.getElementById('ticketTime');
    const titleDisplay = document.getElementById('ticketTitle');
    const locDisplay = document.getElementById('ticketLocation');
    const descDisplay = document.getElementById('ticketDescription');

    if (idDisplay) idDisplay.innerText = `#${ticket.id}`;
    
    const statusLabels = {
        'Open': _t('ticket.statuses.open', 'Open'),
        'In Progress': _t('ticket.statuses.inProgress', 'In Progress'),
        'Resolved': _t('ticket.statuses.resolved', 'Resolved'),
        'Escrow Approved': _t('ticket.statuses.escrowApproved', 'Escrow Approved')
    };
    
    if (statusBadge) {
        statusBadge.innerText = statusLabels[ticket.status] || ticket.status;
        if (ticket.status === 'Resolved') {
            statusBadge.className = 'text-xs font-black px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider';
        } else if (ticket.status === 'In Progress') {
            statusBadge.className = 'text-xs font-black px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wider animate-pulse';
        } else {
            statusBadge.className = 'text-xs font-black px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 uppercase tracking-wider';
        }
    }
    
    if (upvotesBadge) {
        const priorityLabel = _t('ticket.highPriority', 'Priority');
        const upvotesLabel = _t('student.upvotes', 'Upvotes');
        upvotesBadge.innerHTML = `<i class="fa-solid fa-fire-flame-curved mr-1.5"></i> ${priorityLabel}: ${ticket.priority_score || 50}/100 • ${ticket.upvotes || 0} ${upvotesLabel}`;
    }

    const parseDate = (d) => {
        if (!d) return null;
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? null : parsed;
    };
    const validDate = parseDate(ticket.created_at);

    if (timeDisplay) {
        const dateStr = validDate ? validDate.toLocaleString() : 'Unknown Date';
        timeDisplay.innerText = `${_t('ticket.reported', 'Reported:')} ${dateStr}`;
    }

    if (titleDisplay) titleDisplay.innerText = ticket.title;
    if (locDisplay) locDisplay.innerText = ticket.location;
    if (descDisplay) descDisplay.innerText = ticket.description;

    const reporterEl = document.getElementById('ticketReporterName');
    if (reporterEl && ticket.reporter_name) {
        const roleLocalized = ticket.reporter_role === 'Student' ? _t('roles.student', 'Student') : (ticket.reporter_role || _t('roles.student', 'Student'));
        reporterEl.innerText = `${ticket.reporter_name} (${roleLocalized})`;
    }

    // Before & After Proof Photos Container
    const evidenceContainer = document.getElementById('ticketEvidenceContainer');
    if (evidenceContainer) {
        let html = '';

        if (ticket.image_url && ticket.resolved_image_url) {
            html = `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md relative group cursor-pointer" onclick="window.open('${ticket.image_url}', '_blank')">
                        <img src="${ticket.image_url}" alt="Before Repair" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center justify-between">
                            <span><i class="fa-solid fa-camera text-blue-400 mr-1"></i> ${_t('ticket.beforeRepair', 'Before Repair (Reported)')}</span>
                            <i class="fa-solid fa-expand text-xs"></i>
                        </div>
                    </div>

                    <div class="rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 shadow-md relative group cursor-pointer" onclick="window.open('${ticket.resolved_image_url}', '_blank')">
                        <img src="${ticket.resolved_image_url}" alt="After Repair" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-xs font-black flex items-center justify-between">
                            <span><i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> ${_t('ticket.afterRepair', 'After Repair (Resolved Proof)')}</span>
                            <i class="fa-solid fa-expand text-xs"></i>
                        </div>
                    </div>
                </div>
            `;
        } else if (ticket.image_url) {
            html = `
                <div class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md relative group cursor-pointer" onclick="window.open('${ticket.image_url}', '_blank')">
                    <img src="${ticket.image_url}" alt="Initial Evidence" class="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div class="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-colors">
                        <i class="fa-solid fa-expand"></i> ${_t('ticket.viewHighRes', 'View High-Res Image')}
                    </div>
                </div>
            `;
        } else if (ticket.resolved_image_url) {
            html = `
                <div class="rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 shadow-md relative group cursor-pointer" onclick="window.open('${ticket.resolved_image_url}', '_blank')">
                    <img src="${ticket.resolved_image_url}" alt="After Repair Proof" class="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div class="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-xs font-black flex items-center gap-2 shadow-lg">
                        <i class="fa-solid fa-circle-check text-emerald-400"></i> ${_t('ticket.resolutionProof', 'After Repair Resolution Proof')}
                    </div>
                </div>
            `;
        } else {
            html = `
                <div class="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-500 font-medium text-xs">
                    <i class="fa-solid fa-camera-slash text-3xl text-slate-400 mb-2 block"></i>
                    ${_t('ticket.noPhotoAttached', 'No photo was attached with this report.')}
                </div>
            `;
        }

        // If technician provided notes, append them
        if (ticket.proof_notes) {
            html += `
                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1 mt-3">
                    <div class="flex items-center justify-between font-black text-emerald-900">
                        <span><i class="fa-solid fa-screwdriver-wrench text-emerald-600 mr-1"></i> ${_t('ticket.technicianNotes', 'Technician Resolution Notes')}</span>
                        <span class="text-[11px] text-emerald-700 font-bold">${ticket.assigned_technician || 'Technician'}</span>
                    </div>
                    <p class="font-medium text-slate-700 leading-relaxed">${ticket.proof_notes}</p>
                </div>
            `;
        }

        evidenceContainer.innerHTML = html;
    }

    // Render Live Operational Timeline
    const timelineContainer = document.getElementById('ticketTimelineContainer');
    if (timelineContainer) {
        const createdAtTime = validDate ? validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Time';
        
        const isResolved = ticket.status === 'Resolved';
        const isInProgress = ticket.status === 'In Progress' || isResolved;
        
        let html = `
            <!-- Step 1 -->
            <div class="relative">
                <span class="absolute -left-7 top-1 w-4 h-4 rounded-full ${ticket.status === 'Open' ? 'bg-blue-600 border-2 border-white ring-4 ring-blue-100 animate-pulse' : 'bg-emerald-500 border-2 border-white ring-2 ring-emerald-200'}"></span>
                <div class="text-sm font-black ${ticket.status === 'Open' ? 'text-blue-600' : 'text-slate-900'}">${_t('ticket.step1Title', 'Reported & AI Triaged')}</div>
                <div class="text-xs ${ticket.status === 'Open' ? 'text-slate-700 font-semibold' : 'text-slate-500'} mt-1 leading-relaxed">${_t('ticket.step1Desc', 'Assigned automatically based on categorization')}</div>
                <div class="text-[11px] text-slate-400 mt-1 font-bold">${createdAtTime} • System Automation</div>
            </div>

            <!-- Step 2 -->
            <div class="relative ${!isInProgress ? 'opacity-60' : ''}">
                <span class="absolute -left-7 top-1 w-4 h-4 rounded-full ${ticket.status === 'In Progress' ? 'bg-blue-600 border-2 border-white ring-4 ring-blue-100 animate-pulse' : (isResolved ? 'bg-emerald-500 border-2 border-white ring-2 ring-emerald-200' : 'bg-slate-300 border-2 border-white')}"></span>
                <div class="text-sm font-black ${ticket.status === 'In Progress' ? 'text-blue-600' : 'text-slate-900'}">${_t('ticket.step2Title', 'Repair In Progress & Safety Isolated')}</div>
                <div class="text-xs ${ticket.status === 'In Progress' ? 'text-slate-700 font-semibold' : 'text-slate-500'} mt-1 leading-relaxed">${isInProgress ? `${_t('roles.facility', 'Technician')} ${ticket.assigned_technician || ''} ${_t('ticket.step2Desc', 'working on-site')}` : _t('facility.unassigned', 'Awaiting technician assignment')}</div>
                <div class="text-[11px] text-slate-400 mt-1 font-bold">${isInProgress ? _t('facility.inProgress', 'Active • On-Site Crew') : _t('facility.unassigned', 'Pending')}</div>
            </div>

            <!-- Step 3 -->
            <div class="relative ${!isResolved ? 'opacity-60' : ''}">
                <span class="absolute -left-7 top-1 w-4 h-4 rounded-full ${isResolved ? 'bg-emerald-500 border-2 border-white ring-2 ring-emerald-200' : 'bg-slate-300 border-2 border-white'}"></span>
                <div class="text-sm font-black ${isResolved ? 'text-slate-900' : 'text-slate-700'}">${_t('ticket.step3Title', 'Proof of Work Submitted & Closed')}</div>
                <div class="text-xs ${isResolved ? 'text-slate-500' : 'text-slate-400'} mt-1 leading-relaxed">${isResolved ? _t('ticket.step3Desc', 'Issue successfully resolved and verified') : _t('ticket.resolutionProof', 'Pending after-repair photo verification')}</div>
                <div class="text-[11px] text-slate-400 mt-1 font-bold">${isResolved ? _t('facility.completed', 'Closed • System') : _t('facility.unassigned', 'Pending')}</div>
            </div>
        `;

        timelineContainer.innerHTML = html;
    }

    // Update Rating Button state
    const submitRatingBtn = document.getElementById('submitRatingBtn');
    if (submitRatingBtn) {
        if (ticket.status !== 'Resolved') {
            submitRatingBtn.disabled = true;
            submitRatingBtn.innerText = _t('ticket.availableAfterResolution', 'Available after resolution');
            submitRatingBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else if (ticket.feedback_rating) {
            selectedRating = ticket.feedback_rating;
            updateStars(selectedRating);
            submitRatingBtn.disabled = true;
            submitRatingBtn.innerText = _t('ticket.feedbackSubmitted', 'Feedback Submitted');
            submitRatingBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            submitRatingBtn.innerText = _t('ticket.submitReview', 'Submit Review');
        }
    }
}

function updateStars(rating, hover = false) {
    const ratingStars = document.querySelectorAll('#ratingStars i');
    ratingStars.forEach(star => {
        const starVal = parseInt(star.dataset.rating);
        if (starVal <= rating) {
            star.classList.remove('text-slate-300');
            star.classList.add('text-amber-400');
            if (hover) star.classList.add('opacity-80');
            else star.classList.remove('opacity-80');
        } else {
            star.classList.remove('text-amber-400');
            star.classList.add('text-slate-300');
            star.classList.remove('opacity-80');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        window.location.href = 'student.html';
        return;
    }

    try {
        const ticket = await fetchAPI(`/tickets/${id}`);
        if (!ticket) return;
        currentTicket = ticket;

        renderTicketDetails(currentTicket);

        // Setup Rating Interactivity
        const ratingStars = document.querySelectorAll('#ratingStars i');
        const submitRatingBtn = document.getElementById('submitRatingBtn');

        if (!ratingEventsBound && ratingStars.length && submitRatingBtn) {
            ratingEventsBound = true;

            if (ticket.feedback_rating) {
                selectedRating = ticket.feedback_rating;
                updateStars(selectedRating);
            }

            ratingStars.forEach(star => {
                star.addEventListener('mouseover', (e) => updateStars(e.target.dataset.rating, true));
                star.addEventListener('mouseout', () => updateStars(selectedRating));
                star.addEventListener('click', (e) => {
                    selectedRating = parseInt(e.target.dataset.rating);
                    updateStars(selectedRating);
                });
            });

            submitRatingBtn.addEventListener('click', async () => {
                if (selectedRating === 0) {
                    triggerToast(_t('common.error', 'Error'), _t('ticket.rateRepair', 'Please select a rating first'), 'error');
                    return;
                }
                submitRatingBtn.disabled = true;
                submitRatingBtn.innerText = _t('ticket.submittingReview', 'Submitting...');
                
                try {
                    const updated = await fetchAPI(`/tickets/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({ feedback_rating: selectedRating })
                    });
                    
                    if (updated) {
                        currentTicket.feedback_rating = selectedRating;
                        triggerToast(_t('common.success', 'Success'), _t('ticket.feedbackSubmitted', 'Feedback Submitted'), 'success');
                        submitRatingBtn.innerText = _t('ticket.feedbackSubmitted', 'Feedback Submitted');
                        submitRatingBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                } catch (error) {
                    console.error('Failed to submit rating', error);
                    submitRatingBtn.disabled = false;
                    submitRatingBtn.innerText = _t('ticket.submitReview', 'Submit Review');
                    triggerToast(_t('common.error', 'Error'), _t('common.error', 'Failed to save feedback'), 'error');
                }
            });
        }
    } catch(err) {
        console.error('Failed to fetch ticket:', err);
    }
});

window.addEventListener('languageChanged', () => {
    if (currentTicket) {
        renderTicketDetails(currentTicket);
    }
});
