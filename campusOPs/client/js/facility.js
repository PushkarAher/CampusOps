// CampusOps - Technician Operations & Facility Control Center (facility.js)

function _t(key, fallback) {
    if (typeof window.t === 'function') {
        const res = window.t(key);
        if (res && res !== key) return res;
    }
    return fallback;
}

let allTasks = [];
let workerProfile = null;
let currentDepartmentFilter = 'mydept'; // 'mydept', 'all', 'electrical', 'hvac', 'plumbing', 'furniture'
let currentStatusFilter = 'all'; // 'all', 'Open', 'In Progress', 'Resolved'
let activeLocationFilter = null;

let activeResolveTaskId = null;
let resolvePhotoData = null;
let resolveCameraStream = null;

let activeSafetyTaskId = null;
let areaHtml5QrCode = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchTasks();
    setInterval(fetchTasks, 5000); // Poll for live database updates

    // Check for pre-filled location from URL (e.g. from Qr-resolver.html)
    const urlParams = new URLSearchParams(window.location.search);
    const locParam = urlParams.get('location');
    if (locParam) {
        setLocationFilter(locParam);
    }
});

window.addEventListener('languageChanged', () => {
    fetchProfile();
    updateKpiMetrics();
    filterAndRenderTasks();
});


// ----------------------------------------------------
// 1. TECHNICIAN PROFILE & TRADE SETUP
// ----------------------------------------------------
async function fetchProfile() {
    try {
        const metadata = await fetchAPI('/me');
        if (metadata) {
            workerProfile = metadata;
            const nameEl = document.getElementById('profileName');
            const tradeEl = document.getElementById('profileTradeBadge');
            const initialsEl = document.getElementById('profileInitials');
            const myTradeLabel = document.getElementById('myTradeBtnLabel');
            const statTradeLabel = document.getElementById('statMyTradeLabel');

            const fullName = metadata.fullName || 'Ramesh Kumar';
            const tradeName = metadata.trade || metadata.department || 'Electrical Maintenance';
            const workerId = metadata.workerId || metadata.employeeId || 'WRK-504';

            if (nameEl) nameEl.textContent = fullName;
            if (tradeEl) tradeEl.textContent = `${workerId} • ${tradeName}`;

            if (myTradeLabel) {
                const shortTrade = tradeName.split(' ')[0] || 'Electrical';
                const prefix = _t('facility.myTradePrefix', 'My Trade:');
                myTradeLabel.textContent = `${prefix} ${shortTrade}`;
            }

            if (statTradeLabel) {
                const shortTrade = tradeName.split(' ')[0] || 'My Trade';
                const taskWord = _t('facility.myTradeTasks', 'Tasks');
                statTradeLabel.textContent = `${shortTrade} ${taskWord}`;
            }

            if (initialsEl && fullName) {
                const names = fullName.split(' ');
                let initials = names[0].charAt(0);
                if (names.length > 1) {
                    initials += names[names.length - 1].charAt(0);
                }
                initialsEl.textContent = initials.toUpperCase();
            }
        }
    } catch (err) {
        console.error('Error fetching technician profile:', err);
    }
}

// ----------------------------------------------------
// 2. FETCH & PROCESS TASKS
// ----------------------------------------------------
async function fetchTasks() {
    try {
        const response = await fetchAPI('/tickets');
        if (!response) return;
        allTasks = response || [];
        updateKpiMetrics();
        filterAndRenderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function updateKpiMetrics() {
    // 1. My Trade Tasks
    const myTradeTasks = allTasks.filter(t => ticketMatchesTrade(t, 'mydept'));
    const statMyTrade = document.getElementById('statMyTradeCount');
    if (statMyTrade) statMyTrade.innerText = myTradeTasks.length;

    // 2. Urgent / Class in Session
    const urgentTasks = allTasks.filter(t => t.class_in_session_active || t.is_sla_escalated || (t.priority_score && t.priority_score >= 80));
    const statUrgent = document.getElementById('statUrgentCount');
    if (statUrgent) statUrgent.innerText = urgentTasks.length;

    // 3. In Progress
    const inProgressTasks = allTasks.filter(t => t.status === 'In Progress');
    const statInProgress = document.getElementById('statInProgressCount');
    if (statInProgress) statInProgress.innerText = inProgressTasks.length;

    // 4. Resolved
    const resolvedTasks = allTasks.filter(t => t.status === 'Resolved');
    const statResolved = document.getElementById('statResolvedCount');
    if (statResolved) statResolved.innerText = resolvedTasks.length;
}

// ----------------------------------------------------
// 3. TRADE MATCHING LOGIC
// ----------------------------------------------------
const TRADE_KEYWORDS = {
    electrical: [
        'electrical', 'switchboard', 'socket', 'plug', 'spark', 'wire', 'mcb',
        'breaker', 'light', 'lamp', 'fan', 'projector', 'av', 'audio', 'sound',
        'microphone', 'outlet', 'computer', 'lab equipment', 'power', 'tripped', 'short circuit'
    ],
    hvac: [
        'hvac', 'ac', 'air condition', 'cooling', 'chiller', 'thermostat', 'vent', 'ventilation', 'compressor'
    ],
    plumbing: [
        'plumbing', 'water', 'pipe', 'leak', 'tap', 'faucet', 'restroom', 'washroom', 'toilet', 'drainage', 'flush'
    ],
    furniture: [
        'furniture', 'desk', 'chair', 'bench', 'podium', 'table', 'door', 'window', 'lock', 'carpentry', 'hinge'
    ],
    sanitation: [
        'sanitation', 'housekeeping', 'cleaning', 'trash', 'waste', 'spill', 'dustbin'
    ]
};

function ticketMatchesTrade(ticket, tradeType) {
    if (tradeType === 'all') return true;

    const workerTrade = (workerProfile?.trade || workerProfile?.department || 'Electrical').toLowerCase();

    if (tradeType === 'mydept') {
        // If assigned directly to this worker
        if (workerProfile && ticket.assigned_technician && ticket.assigned_technician.toLowerCase().includes(workerProfile.fullName.toLowerCase())) {
            return true;
        }

        // Check if ticket explicitly assigned to this trade category
        if (workerTrade.includes('electric') || workerTrade.includes('power')) {
            tradeType = 'electrical';
        } else if (workerTrade.includes('plumb')) {
            tradeType = 'plumbing';
        } else if (workerTrade.includes('hvac') || workerTrade.includes('cool')) {
            tradeType = 'hvac';
        } else if (workerTrade.includes('carpent') || workerTrade.includes('furnitur')) {
            tradeType = 'furniture';
        } else if (workerTrade.includes('sanitat') || workerTrade.includes('clean')) {
            tradeType = 'sanitation';
        } else {
            tradeType = 'electrical';
        }
    }

    const keywords = TRADE_KEYWORDS[tradeType] || [];
    const textToMatch = `${ticket.title || ''} ${ticket.description || ''} ${ticket.department || ''}`.toLowerCase();

    return keywords.some(k => textToMatch.includes(k));
}

// ----------------------------------------------------
// 4. FILTERING & RENDERING
// ----------------------------------------------------
function setDepartmentFilter(trade) {
    currentDepartmentFilter = trade;

    document.querySelectorAll('[id^="tradeTab-"]').forEach(btn => {
        btn.className = 'tab-inactive px-3.5 py-2 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1 flex-shrink-0';
    });

    const activeBtn = document.getElementById('tradeTab-' + trade);
    if (activeBtn) {
        activeBtn.className = 'tab-active px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 flex-shrink-0';
    }

    filterAndRenderTasks();
}

function setStatusFilter(status) {
    currentStatusFilter = status;

    const buttons = {
        'all': 'statusBtn-all',
        'Open': 'statusBtn-open',
        'In Progress': 'statusBtn-inprogress',
        'Resolved': 'statusBtn-resolved'
    };

    Object.keys(buttons).forEach(st => {
        const btn = document.getElementById(buttons[st]);
        if (btn) {
            if (st === status) {
                btn.className = 'px-3 py-1.5 rounded-xl font-black text-xs bg-white text-slate-900 shadow-xs cursor-pointer';
            } else {
                btn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 cursor-pointer';
            }
        }
    });

    filterAndRenderTasks();
}

function setLocationFilter(loc) {
    activeLocationFilter = loc;
    const banner = document.getElementById('activeLocationBanner');
    const locText = document.getElementById('activeLocationText');
    if (banner && locText) {
        locText.innerText = loc;
        banner.classList.remove('hidden');
    }
    filterAndRenderTasks();
}

function clearLocationFilter() {
    activeLocationFilter = null;
    const banner = document.getElementById('activeLocationBanner');
    if (banner) banner.classList.add('hidden');
    filterAndRenderTasks();
}

function searchWorkerTasks() {
    filterAndRenderTasks();
}

function filterAndRenderTasks() {
    const container = document.getElementById('taskListContainer');
    if (!container) return;

    const searchInput = document.getElementById('taskSearchInput');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filtered = allTasks.filter(task => {
        // 1. Department / Trade Filter
        if (!ticketMatchesTrade(task, currentDepartmentFilter)) {
            return false;
        }

        // 2. Status Filter
        if (currentStatusFilter !== 'all' && task.status !== currentStatusFilter) {
            return false;
        }

        // 3. Location Filter (from QR scan)
        if (activeLocationFilter) {
            const taskLoc = (task.location || '').toLowerCase();
            if (!taskLoc.includes(activeLocationFilter.toLowerCase())) {
                return false;
            }
        }

        // 4. Keyword search
        if (query) {
            const haystack = `${task.id} ${task.title} ${task.location} ${task.description || ''} ${task.assigned_technician || ''}`.toLowerCase();
            if (!haystack.includes(query)) {
                return false;
            }
        }

        return true;
    });

    // Sort order: Class in session / urgent first, then priority score desc, then newest
    filtered.sort((a, b) => {
        const aUrgent = (a.class_in_session_active || a.is_sla_escalated) ? 1 : 0;
        const bUrgent = (b.class_in_session_active || b.is_sla_escalated) ? 1 : 0;
        if (bUrgent !== aUrgent) return bUrgent - aUrgent;
        return (b.priority_score || 0) - (a.priority_score || 0);
    });

    const badge = document.getElementById('taskCountBadge');
    if (badge) {
        const taskWord = _t('facility.tasksInQueue', filtered.length === 1 ? 'Task in Queue' : 'Tasks in Queue');
        badge.innerText = `${filtered.length} ${taskWord}`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-1 md:col-span-2 glass-card p-10 rounded-3xl text-center border border-dashed border-amber-200">
                <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <h3 class="text-lg font-black text-slate-900">${_t('facility.noActiveOrders', 'No active work orders')}</h3>
                <p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
                    ${_t('facility.noActiveOrdersSub', 'There are no tasks matching the selected department trade and filters.')}
                </p>
                <button onclick="setDepartmentFilter('all')" type="button" class="px-5 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-50 cursor-pointer shadow-xs">
                    ${_t('facility.allCampus', 'View All Campus Reports')}
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(task => renderTaskCard(task)).join('');
}

// ----------------------------------------------------
// 5. TASK CARD HTML GENERATOR
// ----------------------------------------------------
function renderTaskCard(task) {
    const isResolved = task.status === 'Resolved';
    const isInProgress = task.status === 'In Progress';
    const isOpen = task.status === 'Open';

    const isClassInSession = Boolean(task.class_in_session_active);
    const isFacultyEndorsed = Boolean(task.faculty_endorsed);
    const isSlaEscalated = Boolean(task.is_sla_escalated);

    let statusBadgeClass = 'bg-slate-100 text-slate-800 border-slate-200';
    if (isInProgress) statusBadgeClass = 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
    if (isResolved) statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';

    const localizedStatus = _t('ticket.statuses.' + (isInProgress ? 'inProgress' : isResolved ? 'resolved' : 'open'), task.status);

    // Duplicate triage banner
    let triageBanner = '';
    if (task.requires_human_triage) {
        triageBanner = `
            <div class="bg-amber-100/90 border border-amber-300 text-amber-900 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5">
                <i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-700 text-sm"></i>
                <div class="flex-1">
                    <p class="font-extrabold">Potential Duplicate Cluster Detected</p>
                    <p class="font-medium text-slate-700 mt-0.5">Report may overlap with Ticket #${task.potential_duplicate_of ? task.potential_duplicate_of.substring(0, 8) : 'Master'}.</p>
                    <div class="grid grid-cols-2 gap-2 mt-2 font-extrabold text-[11px]">
                        <button onclick="handleTriage('${task.id}', '${task.potential_duplicate_of}', true)" type="button" class="py-1.5 px-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">
                            Merge Duplicate
                        </button>
                        <button onclick="handleTriage('${task.id}', null, false)" type="button" class="py-1.5 px-2.5 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 cursor-pointer">
                            Keep Distinct
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Action buttons depending on status
    let actionButtons = '';
    if (!task.requires_human_triage) {
        if (isOpen) {
            actionButtons = `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    <button onclick="acceptTask('${task.id}')" type="button" class="btn-gradient py-3 px-4 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md">
                        <i class="fa-solid fa-hand-holding-hand"></i>
                        <span>${_t('facility.acceptTask', 'Accept Task')}</span>
                    </button>
                    <button onclick="openSafetyModal('${task.id}')" type="button" class="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-shield-halved text-amber-600"></i>
                        <span>${_t('facility.safetyChecklist', 'Safety Checklist')}</span>
                    </button>
                </div>
                ${task.assigned_technician !== 'External Vendor' ? `
                <button onclick="requestVendor('${task.id}', '${escapeHtml(task.description || '')}')" type="button" class="w-full mt-2 py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-truck"></i>
                    <span>${_t('facility.requestVendor', 'Request External Vendor')}</span>
                </button>
                ` : ''}
            `;
        } else if (isInProgress) {
            actionButtons = `
                <div class="space-y-2 pt-2">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button onclick="openSafetyModal('${task.id}')" type="button" class="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-shield-halved text-amber-600"></i>
                            <span>${task.safety_checklist_completed ? _t('facility.lotoVerified', '✓ Safety LOTO Verified') : _t('facility.safetyChecklist', 'Safety Checklist')}</span>
                        </button>
                        <button onclick="openResolutionModal('${task.id}')" type="button" class="btn-resolve py-3 px-3 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md animate-pulse hover:animate-none">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>${_t('facility.markResolved', 'Mark Resolved (Proof)')}</span>
                        </button>
                    </div>
                </div>
                ${task.assigned_technician !== 'External Vendor' ? `
                <button onclick="requestVendor('${task.id}', '${escapeHtml(task.description || '')}')" type="button" class="w-full mt-2 py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-truck"></i>
                    <span>${_t('facility.requestVendor', 'Request External Vendor')}</span>
                </button>
                ` : ''}
            `;
        } else if (isResolved) {
            actionButtons = `
                <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between text-xs font-bold text-emerald-900 gap-2">
                    <span class="flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                        <span>${_t('facility.verifiedBy', 'Verified & Resolved by:')} <strong class="text-slate-900 font-extrabold">${escapeHtml(task.assigned_technician || 'Technician')}</strong></span>
                    </span>
                    <span class="text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        ${task.resolved_at ? new Date(task.resolved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Done'}
                    </span>
                </div>
            `;
        }
    }

    return `
    <article class="glass-card p-6 sm:p-7 rounded-3xl border-2 ${isClassInSession ? 'border-rose-400 shadow-md' : (task.faculty_endorsed ? 'border-purple-200' : 'border-slate-200')} flex flex-col justify-between space-y-4 hover:border-amber-400 transition" id="card-${task.id}">
        
        <div>
            ${triageBanner}

            <!-- Top Badges & ID -->
            <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${statusBadgeClass}">
                        ${localizedStatus}
                    </span>

                    ${isClassInSession ? `
                        <span class="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1 animate-pulse">
                            <i class="fa-solid fa-bolt text-rose-600 text-[10px]"></i> ${_t('facility.classInSession', 'Class in Session')}
                        </span>
                    ` : ''}

                    ${isFacultyEndorsed ? `
                        <span class="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                            <i class="fa-solid fa-award text-purple-600 text-xs"></i> ${_t('teacher.endorsed', 'Faculty Endorsed')}
                        </span>
                    ` : ''}

                    ${task.safety_checklist_completed ? `
                        <span class="px-2 py-0.5 rounded-lg text-[11px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <i class="fa-solid fa-shield text-amber-600"></i> LOTO Verified
                        </span>
                    ` : ''}
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                        Priority: ${task.priority_score || 50}/100
                    </span>
                    <span class="text-xs font-bold text-slate-400">#${task.id.substring(0, 8)}</span>
                </div>
            </div>

            <!-- Location Callout -->
            <div class="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3 mb-3">
                <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base flex-shrink-0">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="truncate">
                        <span class="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider block">Classroom / Location</span>
                        <div class="text-base font-black text-slate-900 truncate">
                            ${escapeHtml(task.location || 'Campus Location')}
                        </div>
                    </div>
                </div>
                <button type="button" onclick="setLocationFilter('${escapeHtml(task.location)}')" title="Filter this room" class="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex-shrink-0 cursor-pointer">
                    Filter Room
                </button>
            </div>

            <!-- Problem Title & Description -->
            <div class="space-y-1 mb-3">
                <div class="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    ${escapeHtml(task.title)}
                </div>
                <p class="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                    ${escapeHtml(task.description || 'No detailed description provided.')}
                </p>
            </div>

            <!-- Initial Reporter Proof Photo (Before Repair) -->
            ${task.image_url ? `
                <div class="mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group cursor-pointer relative" onclick="openImageViewer('${escapeHtml(task.image_url)}', 'Initial Issue Proof - ${escapeHtml(task.title)}')">
                    <img src="${task.image_url}" alt="Initial Proof" class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 group-hover:bg-amber-600 transition-colors">
                        <i class="fa-solid fa-camera text-amber-400"></i>
                        <span>Before Photo (Student/Faculty Proof)</span>
                    </div>
                </div>
            ` : ''}

            <!-- Resolved Proof Photo (After Repair) -->
            ${task.resolved_image_url ? `
                <div class="mb-3 rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 group cursor-pointer relative" onclick="openImageViewer('${escapeHtml(task.resolved_image_url)}', 'Resolved Evidence - ${escapeHtml(task.title)}')">
                    <img src="${task.resolved_image_url}" alt="After Repair Proof" class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[11px] font-black flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check text-emerald-400"></i>
                        <span>After-Repair Visual Verification</span>
                    </div>
                </div>
            ` : ''}

            <!-- Proof Notes / Work Done (if present) -->
            ${task.proof_notes ? `
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mb-3">
                    <span class="font-extrabold text-slate-900 block mb-0.5">Technician Resolution Notes:</span>
                    <p class="font-medium leading-relaxed">${escapeHtml(task.proof_notes)}</p>
                </div>
            ` : ''}

            <!-- Assigned Technician Tag -->
            <div class="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                <span>Reporter: <strong class="text-slate-800">${escapeHtml(task.reporter_name || 'Campus Member')}</strong></span>
                <span>Assigned: <strong class="text-amber-800 font-extrabold">${escapeHtml(task.assigned_technician || 'Unassigned')}</strong></span>
            </div>
        </div>

        <!-- Action Button Panel -->
        ${actionButtons}
    </article>
    `;
}

// ----------------------------------------------------
// 6. ACCEPT TASK HANDLER
// ----------------------------------------------------
async function acceptTask(taskId) {
    try {
        const workerName = workerProfile?.fullName || 'Ramesh Kumar (Senior Electrician)';
        const res = await fetchAPI(`/tickets/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: 'In Progress',
                assigned_technician: workerName
            })
        });

        if (res) {
            showToast('Task Accepted', `Work order assigned to ${workerName}. Status: In Progress.`);
            fetchTasks();
        } else {
            showToast('Error', 'Failed to accept task.', true);
        }
    } catch (err) {
        console.error('Accept task error:', err);
        showToast('Error', 'Network error accepting task.', true);
    }
}

async function requestVendor(taskId, currentDescription) {
    if (!confirm('Are you sure you want to request an external vendor for this task?')) return;
    
    try {
        const res = await fetchAPI(`/tickets/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                assigned_technician: 'External Vendor',
                description: currentDescription + '\n\n[VENDOR REQUIRED]'
            })
        });

        if (res) {
            showToast('Vendor Requested', 'Admin has been notified to assign an external vendor.');
            fetchTasks();
        } else {
            showToast('Error', 'Failed to request vendor.', true);
        }
    } catch (err) {
        console.error('Request vendor error:', err);
        showToast('Error', 'Network error requesting vendor.', true);
    }
}

// ----------------------------------------------------
// 7. SAFETY CLEARANCE & LOTO MODAL
// ----------------------------------------------------
function openSafetyModal(taskId) {
    activeSafetyTaskId = taskId;
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('safetyModal');
    const subtitle = document.getElementById('safetyTicketSubtitle');

    if (subtitle) {
        subtitle.innerText = `Task #${task.id.substring(0, 8)} • ${task.location}`;
    }

    const ppeChk = document.getElementById('chkSafetyPpe');
    const lotoChk = document.getElementById('chkSafetyLoto');
    const barChk = document.getElementById('chkSafetyBarricade');

    const checklist = task.safety_checklist || {};
    if (ppeChk) ppeChk.checked = checklist.ppe || task.safety_checklist_completed || false;
    if (lotoChk) lotoChk.checked = checklist.loto || task.safety_checklist_completed || false;
    if (barChk) barChk.checked = checklist.barricade || task.safety_checklist_completed || false;

    if (modal) modal.classList.remove('hidden');
}

function closeSafetyModal() {
    activeSafetyTaskId = null;
    const modal = document.getElementById('safetyModal');
    if (modal) modal.classList.add('hidden');
}

async function saveSafetyClearance() {
    if (!activeSafetyTaskId) return;

    const ppe = document.getElementById('chkSafetyPpe')?.checked || false;
    const loto = document.getElementById('chkSafetyLoto')?.checked || false;
    const barricade = document.getElementById('chkSafetyBarricade')?.checked || false;

    if (!ppe || !loto || !barricade) {
        showToast('Checklist Incomplete', 'Please verify all 3 institutional safety clearance items before proceeding.', true);
        return;
    }

    try {
        const res = await fetchAPI(`/tickets/${activeSafetyTaskId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                safety_checklist_completed: true,
                safety_checklist: { ppe, loto, barricade, verified_at: new Date().toISOString() },
                status: 'In Progress'
            })
        });

        if (res) {
            closeSafetyModal();
            showToast('Safety Clearance Saved', 'LOTO checklist verified. Proceed with repair.');
            fetchTasks();
        }
    } catch (err) {
        console.error('Safety clearance error:', err);
        showToast('Error', 'Failed to save safety checklist.', true);
    }
}

// ----------------------------------------------------
// 8. RESOLUTION & VISUAL PROOF CAPTURE
// ----------------------------------------------------
function openResolutionModal(taskId) {
    activeResolveTaskId = taskId;
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('resolutionModal');
    const subtitle = document.getElementById('resolveTicketSubtitle');
    const locText = document.getElementById('resolveLocationText');
    const titleText = document.getElementById('resolveTitleText');
    const priorityText = document.getElementById('resolvePriorityText');
    const notesInput = document.getElementById('resolveNotesInput');

    if (subtitle) subtitle.innerText = `Task #${task.id.substring(0, 8)}`;
    if (locText) locText.innerText = task.location || 'Classroom';
    if (titleText) titleText.innerText = task.title || 'Incident';
    if (priorityText) priorityText.innerText = `Priority: ${task.priority_score || 50}/100`;
    if (notesInput) notesInput.value = '';

    removeResolvePhoto();

    if (modal) modal.classList.remove('hidden');
}

function closeResolutionModal() {
    activeResolveTaskId = null;
    closeResolveCamera();
    removeResolvePhoto();
    const modal = document.getElementById('resolutionModal');
    if (modal) modal.classList.add('hidden');
}

async function openResolveCamera() {
    const cameraBox = document.getElementById('resolveCameraBox');
    const actionButtons = document.getElementById('resolvePhotoActionButtons');
    const previewBox = document.getElementById('resolvePhotoPreviewBox');
    const video = document.getElementById('resolveCameraVideo');

    if (previewBox) previewBox.classList.add('hidden');
    if (actionButtons) actionButtons.classList.add('hidden');
    if (cameraBox) cameraBox.classList.remove('hidden');

    try {
        if (resolveCameraStream) {
            resolveCameraStream.getTracks().forEach(t => t.stop());
        }

        resolveCameraStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
            audio: false
        });

        if (video) {
            video.srcObject = resolveCameraStream;
            await video.play();
        }
    } catch (err) {
        console.error('Camera access error:', err);
        closeResolveCamera();
        showToast('Camera Permission', 'Could not open camera. You can also upload a photo file.', true);
    }
}

function closeResolveCamera() {
    if (resolveCameraStream) {
        resolveCameraStream.getTracks().forEach(t => t.stop());
        resolveCameraStream = null;
    }
    const video = document.getElementById('resolveCameraVideo');
    if (video) video.srcObject = null;

    const cameraBox = document.getElementById('resolveCameraBox');
    if (cameraBox) cameraBox.classList.add('hidden');

    if (!resolvePhotoData) {
        const actionButtons = document.getElementById('resolvePhotoActionButtons');
        if (actionButtons) actionButtons.classList.remove('hidden');
    }
}

function captureResolvePhoto() {
    const video = document.getElementById('resolveCameraVideo');
    const canvas = document.getElementById('resolveCanvas');

    if (!video || !canvas || !video.videoWidth) {
        showToast('Camera Error', 'Camera feed is not ready yet.', true);
        return;
    }

    let width = video.videoWidth;
    let height = video.videoHeight;
    const maxDimension = 1024;

    if (width > maxDimension || height > maxDimension) {
        if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
        } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
        }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    resolvePhotoData = canvas.toDataURL('image/jpeg', 0.82);

    closeResolveCamera();
    displayResolvePreview(resolvePhotoData);
    showToast('Proof Captured', 'After-repair photo evidence attached.');
}

function triggerResolveFileUpload() {
    const input = document.getElementById('resolveFileInput');
    if (input) input.click();
}

function handleResolveFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Invalid File', 'Please select an image file.', true);
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('resolveCanvas') || document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDimension = 1024;

            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolvePhotoData = canvas.toDataURL('image/jpeg', 0.82);
            displayResolvePreview(resolvePhotoData);
            showToast('Proof Attached', 'Resolution proof image attached.');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayResolvePreview(dataUrl) {
    const previewBox = document.getElementById('resolvePhotoPreviewBox');
    const previewImg = document.getElementById('resolvePreviewImg');
    const actionButtons = document.getElementById('resolvePhotoActionButtons');
    const sizeLabel = document.getElementById('resolvePhotoSizeLabel');

    if (actionButtons) actionButtons.classList.add('hidden');
    if (previewImg) previewImg.src = dataUrl;
    if (previewBox) previewBox.classList.remove('hidden');

    if (sizeLabel && dataUrl) {
        const sizeKb = Math.round((dataUrl.length * 0.75) / 1024);
        sizeLabel.innerText = `${sizeKb} KB • Ready for DB`;
    }
}

function retakeResolvePhoto() {
    removeResolvePhoto();
    openResolveCamera();
}

function removeResolvePhoto() {
    resolvePhotoData = null;
    const previewBox = document.getElementById('resolvePhotoPreviewBox');
    const previewImg = document.getElementById('resolvePreviewImg');
    const fileInput = document.getElementById('resolveFileInput');
    const actionButtons = document.getElementById('resolvePhotoActionButtons');

    if (previewBox) previewBox.classList.add('hidden');
    if (previewImg) previewImg.src = '';
    if (fileInput) fileInput.value = '';
    if (actionButtons) actionButtons.classList.remove('hidden');
}

async function handleResolutionSubmit(event) {
    event.preventDefault();
    if (!activeResolveTaskId) return;

    const notes = document.getElementById('resolveNotesInput')?.value.trim();
    if (!notes) {
        showToast('Required Field', 'Please provide notes on the repair work performed.', true);
        return;
    }

    if (!resolvePhotoData) {
        showToast('Proof Required', 'Mandatory audit: Please attach an After-Repair photo (camera or file).', true);
        return;
    }

    const workerName = workerProfile?.fullName || 'Ramesh Kumar (Senior Electrician)';

    try {
        const updatePayload = {
            status: 'Resolved',
            resolved_at: new Date().toISOString(),
            assigned_technician: workerName,
            proof_notes: notes,
            resolved_image_url: resolvePhotoData,
            verified_proof: true
        };

        const res = await fetchAPI(`/tickets/${activeResolveTaskId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatePayload)
        });

        if (res) {
            closeResolutionModal();
            showToast('Task Resolved!', 'Resolution verified and persisted to Supabase database.');
            fetchTasks();
        } else {
            showToast('Error', 'Failed to mark task resolved.', true);
        }
    } catch (err) {
        console.error('Resolution error:', err);
        showToast('Error', 'Network error during resolution.', true);
    }
}

// ----------------------------------------------------
// 9. AREA QR CODE SCANNER
// ----------------------------------------------------
function openAreaScanner() {
    const modal = document.getElementById('areaQrScannerModal');
    if (modal) modal.classList.remove('hidden');

    if (!areaHtml5QrCode) {
        areaHtml5QrCode = new Html5Qrcode("area-qr-reader");
    }

    areaHtml5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onAreaScanSuccess,
        onAreaScanFailure
    ).catch(err => {
        console.error("Camera start failed", err);
        showToast('Camera Error', 'Could not start QR scanner camera.', true);
    });
}

function closeAreaScanner() {
    const modal = document.getElementById('areaQrScannerModal');
    if (modal) modal.classList.add('hidden');
    if (areaHtml5QrCode && areaHtml5QrCode.isScanning) {
        areaHtml5QrCode.stop().catch(err => console.error("Failed to stop scanning.", err));
    }
}

function onAreaScanSuccess(decodedText) {
    closeAreaScanner();
    let locationName = decodedText;
    try {
        const data = JSON.parse(decodedText);
        locationName = data.room || data.location || decodedText;
    } catch (e) {
        locationName = decodedText;
    }

    setLocationFilter(locationName);
    showToast('Area Verified', `On-site arrival verified. Filtered to ${locationName}.`);
}

function onAreaScanFailure() {
    // Keep scanning silently
}

// ----------------------------------------------------
// 10. LIGHTBOX & FULLSCREEN VIEWER
// ----------------------------------------------------
function openImageViewer(src, title) {
    const modal = document.getElementById('facilityImageViewerModal');
    const img = document.getElementById('imageViewerImg');
    const titleEl = document.getElementById('imageViewerTitle');

    if (img) img.src = src;
    if (titleEl) titleEl.innerText = title || 'Visual Evidence';
    if (modal) modal.classList.remove('hidden');
}

function closeImageViewer() {
    const modal = document.getElementById('facilityImageViewerModal');
    if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------
// 11. DUPLICATE TRIAGE HANDLER
// ----------------------------------------------------
async function handleTriage(ticketId, masterId, isMerge) {
    try {
        if (isMerge && masterId) {
            await fetchAPI(`/tickets/${masterId}`, {
                method: 'PATCH',
                body: JSON.stringify({ upvotes: { increment: true } })
            });
            await fetchAPI(`/tickets/${ticketId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Merged', requires_human_triage: false, is_master: false })
            });
            showToast('Merged Duplicate', 'Ticket clustered into master ticket.');
        } else {
            await fetchAPI(`/tickets/${ticketId}`, {
                method: 'PATCH',
                body: JSON.stringify({ requires_human_triage: false, potential_duplicate_of: null, is_master: true })
            });
            showToast('Kept Distinct', 'Ticket marked as distinct incident.');
        }
        fetchTasks();
    } catch (err) {
        console.error('Triage error:', err);
        showToast('Error', 'Failed to update triage.', true);
    }
}

// ----------------------------------------------------
// 12. UTILITY & TOASTS
// ----------------------------------------------------
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let toastTimeout;
function showToast(header, body, isError = false) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    document.getElementById('toastHeader').innerText = header;
    document.getElementById('toastBody').innerText = body;

    const iconContainer = document.getElementById('toastIconContainer');
    const icon = document.getElementById('toastIcon');

    if (isError) {
        iconContainer.className = 'w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5';
        icon.className = 'fa-solid fa-xmark text-sm';
    } else {
        iconContainer.className = 'w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5';
        icon.className = 'fa-solid fa-check text-sm';
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => hideToast(), 3500);
}

function hideToast() {
    const toast = document.getElementById('toastNotification');
    if (toast) toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
}

// Re-render dynamically on language change without page reload
window.addEventListener('languageChanged', () => {
    if (workerProfile) {
        const myTradeLabel = document.getElementById('myTradeBtnLabel');
        const statTradeLabel = document.getElementById('statMyTradeLabel');
        const tradeName = workerProfile.trade || workerProfile.department || 'Electrical Maintenance';
        const shortTrade = tradeName.split(' ')[0] || 'Electrical';
        if (myTradeLabel) {
            myTradeLabel.textContent = `${_t('facility.myTradePrefix', 'My Trade:')} ${shortTrade}`;
        }
        if (statTradeLabel) {
            statTradeLabel.textContent = `${shortTrade} ${_t('facility.myTradeTasks', 'Tasks')}`;
        }
    }
    filterAndRenderTasks();
});
