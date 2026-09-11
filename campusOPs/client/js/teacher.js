// CampusOps - Faculty Operations & Academic SLA Portal (teacher.js)

let cachedTickets = [];
let currentNoticeFilter = 'all';
let activeCameraStream = null;
let attachedPhotoData = null;
let html5QrCode = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchNotices();
    fetchTickets();

    // Polling every 5 seconds
    setInterval(() => {
        fetchNotices();
        fetchTickets();
    }, 5000);

    // Check for pre-filled location from QR scan
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('location')) {
        toggleReportModal();
        const locInput = document.getElementById('newLocation');
        if (locInput) locInput.value = urlParams.get('location');
    }
});


async function fetchProfile() {
    try {
        const metadata = await fetchAPI('/me');
        if (metadata) {
            const nameEl = document.getElementById('profileName');
            const idEl = document.getElementById('profileId');
            const initialsEl = document.getElementById('profileInitials');

            if (nameEl) nameEl.textContent = metadata.fullName || 'Prof. Faculty Member';

            if (idEl) {
                if (metadata.employeeId) {
                    idEl.textContent = `EMP: ${metadata.employeeId}`;
                } else if (metadata.facultyId) {
                    idEl.textContent = `EMP: ${metadata.facultyId}`;
                } else if (metadata.department) {
                    idEl.textContent = metadata.department;
                } else {
                    idEl.textContent = 'Faculty Authority';
                }
            }

            if (initialsEl && metadata.fullName) {
                const names = metadata.fullName.split(' ');
                let initials = names[0].charAt(0);
                if (names.length > 1) {
                    initials += names[names.length - 1].charAt(0);
                }
                initialsEl.textContent = initials.toUpperCase();
            }
        }
    } catch (err) {
        console.error('Error fetching faculty profile:', err);
    }
}

// ----------------------------------------------------
// NOTICE BOARD
// ----------------------------------------------------
function filterNotices(filterType) {
    currentNoticeFilter = filterType;
    document.querySelectorAll('[id^="noticeTab-"]').forEach(btn => {
        btn.className = 'tab-inactive px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer';
    });
    const activeBtn = document.getElementById('noticeTab-' + filterType);
    if (activeBtn) activeBtn.className = 'tab-active px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer';

    fetchNotices();
}

async function fetchNotices() {
    try {
        const notices = await fetchAPI('/notices');
        if (!notices) return;

        // Ensure admin bulletins appear before AI bulletins
        notices.sort((a, b) => {
            if (a.type === 'admin' && b.type !== 'admin') return -1;
            if (a.type !== 'admin' && b.type === 'admin') return 1;
            return 0;
        });

        const container = document.getElementById('noticeFeedContainer');
        if (!container) return;
        container.innerHTML = '';

        notices.forEach(notice => {
            const isAi = notice.type === 'ai';
            const typeLabel = isAi ? 'AI Insight' : 'Admin Bulletin';
            const color = isAi ? 'purple' : 'orange';
            const icon = isAi ? 'fa-robot' : 'fa-triangle-exclamation';

            if (currentNoticeFilter !== 'all' && notice.type !== currentNoticeFilter) {
                return;
            }

            const card = document.createElement('article');
            card.className = `notice-card bg-white/95 p-5 rounded-2xl border border-${color}-100/90 shadow-xs hover:border-${color}-400/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4`;
            card.innerHTML = `
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2.5 mb-1">
                            <span class="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-${color}-100 text-${color}-800">${typeLabel}</span>
                            <span class="text-xs font-bold text-slate-500">• Just now</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            ${escapeHtml(notice.title)}
                        </h3>
                        <p class="text-sm text-slate-600 mt-1">
                            ${escapeHtml(notice.content)}
                        </p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching notices:', error);
    }
}

// ----------------------------------------------------
// KEYWORD SIMILARITY & SEARCH ENGINE
// ----------------------------------------------------
const STOP_WORDS = new Set([
    'the', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'and', 'or', 'to', 'for', 'of', 'it',
    'my', 'our', 'this', 'that', 'there', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'with', 'about', 'against', 'between',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down',
    'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'please'
]);

function extractKeywords(text) {
    if (!text) return [];
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/gi, ' ')
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length >= 2 && !STOP_WORDS.has(w));
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightKeywords(text, matchedTokens) {
    if (!text) return '';
    if (!matchedTokens || matchedTokens.length === 0) return escapeHtml(text);
    let escaped = escapeHtml(text);
    const sortedTokens = [...new Set(matchedTokens)].sort((a, b) => b.length - a.length);
    sortedTokens.forEach(token => {
        if (!token || token.length < 2) return;
        const regex = new RegExp(`(${escapeRegex(token)})`, 'gi');
        escaped = escaped.replace(regex, '<mark class="bg-purple-100 text-purple-800 font-black px-1 py-0.5 rounded">$1</mark>');
    });
    return escaped;
}

function calculateTicketRelevance(query, ticket) {
    if (!query || !query.trim()) return { score: 0, matchedTokens: [] };

    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = extractKeywords(query);

    const title = (ticket.title || '').toLowerCase();
    const loc = (ticket.location || '').toLowerCase();
    const desc = (ticket.description || '').toLowerCase();
    const fullText = `${title} ${loc} ${desc}`;

    let score = 0;
    const matchedTokens = new Set();

    if (cleanQuery.length >= 3) {
        if (title.includes(cleanQuery)) {
            score += 80;
            queryTokens.forEach(t => matchedTokens.add(t));
        } else if (loc.includes(cleanQuery)) {
            score += 60;
            queryTokens.forEach(t => matchedTokens.add(t));
        } else if (desc.includes(cleanQuery)) {
            score += 40;
            queryTokens.forEach(t => matchedTokens.add(t));
        }
    }

    queryTokens.forEach(token => {
        let tokenFound = false;
        if (title.includes(token)) {
            score += 25;
            tokenFound = true;
        }
        if (loc.includes(token)) {
            score += 20;
            tokenFound = true;
        }
        if (desc.includes(token)) {
            score += 12;
            tokenFound = true;
        }

        const words = fullText.split(/\s+/);
        if (words.some(w => w.startsWith(token) && w !== token)) {
            score += 6;
            tokenFound = true;
        }

        if (tokenFound) {
            matchedTokens.add(token);
        }
    });

    if (queryTokens.length > 1 && matchedTokens.size > 1) {
        const matchRatio = matchedTokens.size / queryTokens.length;
        score += Math.round(matchRatio * 40);
    }

    return {
        score,
        matchedTokens: Array.from(matchedTokens)
    };
}

function filterReports() {
    renderTickets();
}

async function fetchTickets() {
    try {
        const tickets = await fetchAPI('/tickets');
        if (!tickets) return;
        cachedTickets = tickets;
        renderTickets();
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

function renderTickets() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    container.innerHTML = '';

    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';

    let displayedTickets = [];

    if (query) {
        const scoredTickets = cachedTickets.map(ticket => {
            const relevance = calculateTicketRelevance(query, ticket);
            return {
                ...ticket,
                relevance
            };
        });

        const matchingTickets = scoredTickets.filter(t => t.relevance.score > 0);
        matchingTickets.sort((a, b) => {
            if (b.relevance.score !== a.relevance.score) {
                return b.relevance.score - a.relevance.score;
            }
            return (b.priority_score || 0) - (a.priority_score || 0);
        });

        displayedTickets = matchingTickets;
    } else {
        // Faculty default sort: Faculty endorsed first, then highest priority score, then upvotes
        displayedTickets = [...cachedTickets].sort((a, b) => {
            if (Boolean(b.faculty_endorsed) !== Boolean(a.faculty_endorsed)) {
                return b.faculty_endorsed ? 1 : -1;
            }
            return (b.priority_score || 0) - (a.priority_score || 0) || (b.upvotes || 0) - (a.upvotes || 0);
        });
    }

    const badge = document.getElementById('ticketCountBadge');
    const _t = (k, f) => (window.t ? window.t(k, f) : f);

    if (badge) {
        if (query) {
            const matchWord = displayedTickets.length === 1 
                ? _t('student.matchingReport', 'Matching Report')
                : _t('student.matchingReports', 'Matching Reports');
            badge.innerText = `${displayedTickets.length} ${matchWord}`;
        } else {
            badge.innerText = `${displayedTickets.length} ${_t('student.activeReports', 'Active Incidents')}`;
        }
    }

    if (displayedTickets.length === 0) {
        if (query) {
            container.innerHTML = `
                <div class="col-span-1 md:col-span-2 glass-card p-10 rounded-3xl text-center border border-dashed border-purple-200">
                    <div class="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mx-auto mb-3">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h3 class="text-lg font-black text-slate-900">${_t('student.noDuplicateFound', 'No matching issues found')}</h3>
                    <p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                        ${_t('student.noDuplicateDesc', 'No report matches query. You can report it immediately with Academic Priority.')}
                    </p>
                    <button onclick="prefillAndOpenReport('${escapeHtml(query)}')" type="button" class="btn-endorse px-6 py-3 rounded-xl text-white font-extrabold text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span>${_t('teacher.reportAcademicIssue', 'Report Academic Issue Now')}</span>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="col-span-1 md:col-span-2 glass-card p-10 rounded-3xl text-center border border-dashed border-slate-200">
                    <p class="text-sm font-semibold text-slate-500">${_t('student.noActiveTickets', 'No active incidents at this time.')}</p>
                </div>
            `;
        }
        return;
    }

    displayedTickets.forEach((ticket, index) => {
        const card = document.createElement('article');
        card.className = `report-item glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between hover:border-purple-300 transition cursor-pointer relative overflow-hidden ${ticket.faculty_endorsed ? 'border-purple-200 shadow-sm' : ''}`;
        card.onclick = (e) => {
            if (!e.target.closest('button')) {
                window.location.href = `ticket.html?id=${ticket.id}`;
            }
        };

        const matchedTokens = ticket.relevance ? ticket.relevance.matchedTokens : [];
        const isTopMatch = query && index === 0 && ticket.relevance && ticket.relevance.score >= 25;
        const hasRelevance = query && ticket.relevance && ticket.relevance.score > 0;

        const highlightedTitle = highlightKeywords(ticket.title, matchedTokens);
        const highlightedLoc = highlightKeywords(ticket.location, matchedTokens);
        const highlightedDesc = highlightKeywords(ticket.description, matchedTokens);

        const statusLabel = _t('ticket.statuses.' + (ticket.status || 'Open'), ticket.status || 'Open');

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
                            ${statusLabel}
                        </span>

                        ${ticket.faculty_endorsed ? `
                            <span class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1.5 shadow-xs">
                                <i class="fa-solid fa-award text-purple-600"></i>
                                <span>${_t('student.facultyEndorsed', 'Faculty Endorsed')}</span>
                            </span>
                        ` : ''}

                        ${ticket.is_sla_escalated || ticket.class_in_session_active ? `
                            <span class="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 animate-pulse">
                                <i class="fa-solid fa-bolt text-rose-600 text-[10px]"></i> ${_t('student.urgentSla', 'Urgent SLA')}
                            </span>
                        ` : ''}

                        ${isTopMatch ? `
                            <span class="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <i class="fa-solid fa-star text-amber-600 text-[10px]"></i> ${_t('student.mostSimilar', 'Top Match')}
                            </span>
                        ` : (hasRelevance && ticket.relevance.score >= 20 ? `
                            <span class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                                ${_t('student.keywordMatch', 'Match')}
                            </span>
                        ` : '')}
                    </div>
                    <span class="text-xs font-semibold text-slate-400">#${ticket.id}</span>
                </div>

                <div class="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 mb-3">
                    <div class="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        ${highlightedTitle}
                    </div>
                </div>

                <div class="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 mb-3 flex items-center justify-between text-sm font-bold text-slate-800">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-location-dot text-purple-600 text-base"></i>
                        <span>${_t('student.location', 'Location')}: <strong class="text-purple-700 font-black">${highlightedLoc}</strong></span>
                    </div>
                    <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800">
                        ${_t('teacher.priorityLabel', 'Priority')}: ${ticket.priority_score || 50}/100
                    </span>
                </div>

                <p class="text-sm text-slate-600 leading-relaxed font-medium">
                    ${highlightedDesc}
                </p>

                ${ticket.image_url ? `
                    <div class="mt-3 relative rounded-2xl overflow-hidden border border-purple-200 bg-slate-900 group" onclick="event.stopPropagation(); openImageViewer('${escapeHtml(ticket.image_url)}', '${escapeHtml(ticket.title)}')">
                        <img src="${ticket.image_url}" alt="Visual Proof" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md group-hover:bg-purple-600 transition-colors">
                            <i class="fa-solid fa-expand text-xs"></i> ${_t('common.viewImage', 'View Full Photo')}
                        </div>
                    </div>
                ` : ''}

                ${ticket.resolved_image_url ? `
                    <div class="mt-3 relative rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 group" onclick="event.stopPropagation(); openImageViewer('${escapeHtml(ticket.resolved_image_url)}', 'Resolution Verification - ${escapeHtml(ticket.title)}')">
                        <img src="${ticket.resolved_image_url}" alt="Resolution Proof" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md text-emerald-200 text-[11px] font-black flex items-center gap-1.5 shadow-md">
                            <i class="fa-solid fa-circle-check text-emerald-400"></i> ${_t('student.afterRepairProof', 'After-Repair Resolution Proof')}
                        </div>
                    </div>
                ` : ''}

                ${matchedTokens.length > 0 ? `
                    <div class="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        <span class="text-xs font-bold text-slate-400 mr-1">${_t('student.matchedKeywords', 'Matched keywords:')}</span>
                        ${matchedTokens.map(t => `<span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">${escapeHtml(t)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- TEACHER ACTION BAR: FACULTY ENDORSEMENT -->
            <div class="mt-5 pt-5 border-t border-slate-200/80 flex items-center justify-between gap-3">
                ${ticket.faculty_endorsed ? `
                    <div class="flex-1 py-3 px-4 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                        <i class="fa-solid fa-award text-purple-600 text-base"></i>
                        <span>${_t('teacher.endorsedByFaculty', 'Endorsed by Faculty')} (${ticket.upvotes || 0})</span>
                    </div>
                ` : `
                    <button type="button" onclick="endorseTicket('${ticket.id}')" class="flex-1 py-3 rounded-xl btn-endorse text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer group">
                        <i class="fa-solid fa-award text-amber-300 group-hover:scale-110 transition-transform text-sm"></i>
                        <span>${_t('teacher.endorseAction', 'Endorse Issue')} (${ticket.upvotes || 0})</span>
                    </button>
                `}
                <button type="button" onclick="shareTicket('${ticket.id}')" title="Share Ticket Link" class="w-11 h-11 flex-shrink-0 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Live language update listener for faculty portal
window.addEventListener('languageChanged', () => {
    fetchNotices();
    renderTickets();
});

function prefillAndOpenReport(queryText) {
    toggleReportModal();
    const descInput = document.getElementById('newDescription');
    if (descInput && queryText) {
        descInput.value = queryText;
        suggestTickets();
    }
}

function shareTicket(id) {
    const url = `${window.location.origin}/ticket.html?id=${id}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link Copied', 'Ticket link copied to clipboard.');
        }).catch(() => {
            showToast('Ticket URL', url);
        });
    } else {
        showToast('Ticket URL', url);
    }
}

// ----------------------------------------------------
// FACULTY ENDORSEMENT HANDLER
// ----------------------------------------------------
async function endorseTicket(id) {
    try {
        const res = await fetchAPI(`/tickets/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ faculty_endorsed: true })
        });
        if (res) {
            showToast('Faculty Endorsed!', 'You endorsed this issue. Priority elevated to Fast-Track Academic SLA.');
            fetchTickets();
        }
    } catch (err) {
        console.error('Endorsement error:', err);
        showToast('Error', 'Failed to endorse ticket.', true);
    }
}

// ----------------------------------------------------
// MODAL & IN-MODAL DEDUPLICATION SUGGESTER
// ----------------------------------------------------
function toggleReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (modal.classList.contains('hidden')) {
            closeLaptopCamera();
        }
    }
}

function suggestTickets() {
    const locInput = document.getElementById('newLocation') ? document.getElementById('newLocation').value.trim() : '';
    const descInput = document.getElementById('newDescription') ? document.getElementById('newDescription').value.trim() : '';
    const container = document.getElementById('suggestedTicketsContainer');

    if (!container) return;

    if (locInput.length < 3 && descInput.length < 3) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    const scoredCandidates = cachedTickets.map(ticket => {
        let totalScore = 0;
        const matchedTokens = new Set();

        if (locInput.length >= 2) {
            const locRel = calculateTicketRelevance(locInput, ticket);
            totalScore += locRel.score * 1.2;
            locRel.matchedTokens.forEach(t => matchedTokens.add(t));
        }

        if (descInput.length >= 2) {
            const descRel = calculateTicketRelevance(descInput, ticket);
            totalScore += descRel.score;
            descRel.matchedTokens.forEach(t => matchedTokens.add(t));
        }

        return {
            ...ticket,
            score: Math.round(totalScore),
            matchedTokens: Array.from(matchedTokens)
        };
    });

    const matching = scoredCandidates.filter(t => t.score > 0);

    if (matching.length === 0) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    matching.sort((a, b) => b.score - a.score || (b.priority_score || 0) - (a.priority_score || 0));
    const topSuggestions = matching.slice(0, 3);

    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl shadow-sm mb-3">
            <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-200">
                <div class="flex items-center gap-2 text-purple-900 font-black text-xs uppercase tracking-wider">
                    <i class="fa-solid fa-lightbulb text-purple-600 text-sm"></i>
                    <span>Similar issues already reported!</span>
                </div>
                <span class="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Ranked by Match
                </span>
            </div>
            <p class="text-xs text-slate-600 font-medium mb-3">
                Tap <strong>1-Click Endorse</strong> below to instantly escalate the existing report without filing a duplicate ticket:
            </p>
            <div class="space-y-2">
                ${topSuggestions.map((ticket, idx) => `
                    <div class="flex items-center justify-between p-3 bg-white/95 rounded-xl border ${idx === 0 ? 'border-purple-400 shadow-sm' : 'border-slate-100'} hover:border-purple-300 transition gap-3">
                        <div class="flex-1 min-w-0 pr-2">
                            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                                <p class="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                                    ${escapeHtml(ticket.title)}
                                </p>
                                ${idx === 0 ? `
                                    <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">Top Match</span>
                                ` : ''}
                            </div>
                            <p class="text-xs font-semibold text-slate-500 truncate flex items-center gap-1.5">
                                <i class="fa-solid fa-location-dot text-purple-600 text-[11px]"></i>
                                <span>${escapeHtml(ticket.location)}</span>
                                <span class="text-slate-300">•</span>
                                <span class="text-slate-500 font-medium">${escapeHtml(ticket.description || '').substring(0, 45)}...</span>
                            </p>
                        </div>
                        <button type="button" onclick="endorseAndClose('${ticket.id}')" class="flex-shrink-0 px-3.5 py-2 btn-endorse text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-award text-amber-300"></i>
                            <span>Endorse (${ticket.upvotes || 0})</span>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function endorseAndClose(ticketId) {
    await endorseTicket(ticketId);
    toggleReportModal();
    const locInput = document.getElementById('newLocation');
    const descInput = document.getElementById('newDescription');
    const container = document.getElementById('suggestedTicketsContainer');
    if (locInput) locInput.value = '';
    if (descInput) descInput.value = '';
    if (container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
}

// ----------------------------------------------------
// NEW REPORT SUBMISSION
// ----------------------------------------------------
async function handleNewReport(event) {
    event.preventDefault();
    const category = document.getElementById('newCategory');
    const title = category ? category.value : 'Academic Issue';
    const location = document.getElementById('newLocation') ? document.getElementById('newLocation').value : '';
    const description = document.getElementById('newDescription') ? document.getElementById('newDescription').value : '';
    const classToggle = document.getElementById('classInSessionToggle');
    const classInSession = classToggle ? classToggle.checked : false;

    try {
        const payload = {
            title,
            location,
            description,
            class_in_session_active: classInSession,
            image_url: attachedPhotoData || null
        };

        const response = await fetchAPI('/tickets', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response) {
            toggleReportModal();
            event.target.reset();
            removePhoto();
            const suggestBox = document.getElementById('suggestedTicketsContainer');
            if (suggestBox) {
                suggestBox.classList.add('hidden');
                suggestBox.innerHTML = '';
            }
            showToast('Ticket Dispatched', 'Academic ticket submitted with Faculty Endorsement & Priority SLA.');
            fetchTickets();
        } else {
            showToast('Error', 'Failed to submit report.', true);
        }
    } catch (err) {
        console.error('Submit report error:', err);
        showToast('Error', 'Network error while submitting report.', true);
    }
}

// ----------------------------------------------------
// LAPTOP WEBCAM CAPTURE & PHOTO ATTACHMENT
// ----------------------------------------------------
async function openLaptopCamera() {
    const cameraBox = document.getElementById('cameraCaptureBox');
    const actionButtons = document.getElementById('photoActionButtons');
    const previewBox = document.getElementById('photoPreviewBox');
    const video = document.getElementById('cameraVideo');

    if (previewBox) previewBox.classList.add('hidden');
    if (actionButtons) actionButtons.classList.add('hidden');
    if (cameraBox) cameraBox.classList.remove('hidden');

    try {
        if (activeCameraStream) {
            activeCameraStream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        };

        activeCameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (video) {
            video.srcObject = activeCameraStream;
            await video.play();
        }
    } catch (err) {
        console.error('Camera access error:', err);
        closeLaptopCamera();
        showToast('Camera Permission', 'Could not open camera. You can also upload a photo file from your laptop.', true);
    }
}

function closeLaptopCamera() {
    if (activeCameraStream) {
        activeCameraStream.getTracks().forEach(track => track.stop());
        activeCameraStream = null;
    }
    const video = document.getElementById('cameraVideo');
    if (video) video.srcObject = null;

    const cameraBox = document.getElementById('cameraCaptureBox');
    if (cameraBox) cameraBox.classList.add('hidden');

    if (!attachedPhotoData) {
        const actionButtons = document.getElementById('photoActionButtons');
        if (actionButtons) actionButtons.classList.remove('hidden');
    }
}

function capturePhotoFromCamera() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('photoCanvas');

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

    attachedPhotoData = canvas.toDataURL('image/jpeg', 0.82);

    closeLaptopCamera();
    displayPhotoPreview(attachedPhotoData);
    showToast('Photo Captured', 'Visual evidence attached to academic report.');
}

function triggerFileUpload() {
    const input = document.getElementById('photoFileInput');
    if (input) input.click();
}

function handleFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Invalid File', 'Please select a valid image file.', true);
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('photoCanvas') || document.createElement('canvas');
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

            attachedPhotoData = canvas.toDataURL('image/jpeg', 0.82);
            displayPhotoPreview(attachedPhotoData);
            showToast('Photo Attached', 'Visual proof attached to report.');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayPhotoPreview(dataUrl) {
    const previewBox = document.getElementById('photoPreviewBox');
    const previewImg = document.getElementById('photoPreviewImg');
    const actionButtons = document.getElementById('photoActionButtons');
    const cameraBox = document.getElementById('cameraCaptureBox');
    const sizeLabel = document.getElementById('photoSizeLabel');

    if (cameraBox) cameraBox.classList.add('hidden');
    if (actionButtons) actionButtons.classList.add('hidden');

    if (previewImg) previewImg.src = dataUrl;
    if (previewBox) previewBox.classList.remove('hidden');

    if (sizeLabel && dataUrl) {
        const sizeInKb = Math.round((dataUrl.length * 0.75) / 1024);
        sizeLabel.innerText = `${sizeInKb} KB • Ready for DB`;
    }
}

function retakePhoto() {
    removePhoto();
    openLaptopCamera();
}

function removePhoto() {
    attachedPhotoData = null;
    const previewBox = document.getElementById('photoPreviewBox');
    const previewImg = document.getElementById('photoPreviewImg');
    const actionButtons = document.getElementById('photoActionButtons');
    const fileInput = document.getElementById('photoFileInput');

    if (previewBox) previewBox.classList.add('hidden');
    if (previewImg) previewImg.src = '';
    if (fileInput) fileInput.value = '';
    if (actionButtons) actionButtons.classList.remove('hidden');
}

// ----------------------------------------------------
// QR SCANNER
// ----------------------------------------------------
function startScanner() {
    const modal = document.getElementById('qrScannerModal');
    if (modal) modal.classList.remove('hidden');

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        console.error("Camera start failed", err);
        showToast('Camera Error', 'Could not start QR camera. Please check permissions.', true);
    });
}

function closeScanner() {
    const modal = document.getElementById('qrScannerModal');
    if (modal) modal.classList.add('hidden');
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => {
            console.error("Failed to stop scanning.", error);
        });
    }
}

function onScanSuccess(decodedText) {
    const locInput = document.getElementById('newLocation');
    if (locInput) {
        try {
            const data = JSON.parse(decodedText);
            locInput.value = data.room || data.location || decodedText;
        } catch (e) {
            locInput.value = decodedText;
        }
    }
    closeScanner();

    const reportModal = document.getElementById('reportModal');
    if (reportModal && reportModal.classList.contains('hidden')) {
        toggleReportModal();
    }

    showToast('QR Scanned', 'Classroom location auto-filled.');
}

function onScanFailure() {
    // Keep scanning silently
}

// ----------------------------------------------------
// LIGHTBOX & TOAST NOTIFICATIONS
// ----------------------------------------------------
function openImageViewer(src, title) {
    const modal = document.getElementById('imageViewerModal');
    const img = document.getElementById('imageViewerImg');
    const titleEl = document.getElementById('imageViewerTitle');

    if (img) img.src = src;
    if (titleEl) titleEl.innerText = title || 'Visual Proof';
    if (modal) modal.classList.remove('hidden');
}

function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    if (modal) modal.classList.add('hidden');
}

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
        iconContainer.className = 'w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5';
        icon.className = 'fa-solid fa-check text-sm';
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    setTimeout(() => hideToast(), 3500);
}

function hideToast() {
    const toast = document.getElementById('toastNotification');
    if (toast) toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
}
