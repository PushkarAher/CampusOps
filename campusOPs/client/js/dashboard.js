document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchNotices();
    fetchTickets();

    // Polling every 5 seconds
    setInterval(() => {
        fetchNotices();
        fetchTickets();
    }, 5000);
});

async function fetchProfile() {
    try {
        const metadata = await fetchAPI('/me');
        if (metadata) {
            const nameEl = document.getElementById('profileName');
            const idEl = document.getElementById('profileId');
            const initialsEl = document.getElementById('profileInitials');

            if (nameEl) nameEl.textContent = metadata.fullName || 'Student';

            if (idEl) {
                if (metadata.studentId) {
                    idEl.textContent = `PRN: ${metadata.studentId}`;
                } else if (metadata.employeeId) {
                    idEl.textContent = `EMP: ${metadata.employeeId}`;
                } else {
                    idEl.textContent = metadata.role || 'Student';
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
        console.error('Error fetching profile:', err);
    }
}

let currentNoticeFilter = 'all';

function filterNotices(filterType) {
    currentNoticeFilter = filterType;
    document.querySelectorAll('[id^="noticeTab-"]').forEach(btn => {
        btn.className = 'tab-inactive px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer';
    });
    const activeBtn = document.getElementById('noticeTab-' + filterType);
    if (activeBtn) activeBtn.className = 'tab-active px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer';

    fetchNotices(); // Re-render feed
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
            card.setAttribute('data-type', notice.type);
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
                            ${notice.title}
                        </h3>
                        <p class="text-sm text-slate-600 mt-1">
                            ${notice.content}
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

// Stop words to filter out grammatical noise words
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
        escaped = escaped.replace(regex, '<mark class="bg-blue-100 text-blue-700 font-black px-1 py-0.5 rounded">$1</mark>');
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

    // 1. Exact full-phrase match bonus (Highest Weight)
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

    // 2. Token-level keyword matching with weights
    queryTokens.forEach(token => {
        let tokenFound = false;

        // Title match (Weight: 30)
        if (title.includes(token)) {
            score += 30;
            tokenFound = true;
        }

        // Location match (Weight: 25)
        if (loc.includes(token)) {
            score += 25;
            tokenFound = true;
        }

        // Description match (Weight: 12)
        if (desc.includes(token)) {
            score += 12;
            tokenFound = true;
        }

        // Partial / Prefix match bonus if word starts with token (e.g. "proj" -> "projector")
        const words = fullText.split(/\s+/);
        if (words.some(w => w.startsWith(token) && w !== token)) {
            score += 6;
            tokenFound = true;
        }

        if (tokenFound) {
            matchedTokens.add(token);
        }
    });

    // 3. Multi-keyword synergy bonus (if query has multiple words and several match)
    if (queryTokens.length > 1 && matchedTokens.size > 1) {
        const matchRatio = matchedTokens.size / queryTokens.length;
        score += Math.round(matchRatio * 40);
    }

    return {
        score,
        matchedTokens: Array.from(matchedTokens)
    };
}

let cachedTickets = [];

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
        // Calculate relevance scores for all tickets
        const scoredTickets = cachedTickets.map(ticket => {
            const relevance = calculateTicketRelevance(query, ticket);
            return {
                ...ticket,
                relevance
            };
        });

        // Filter only tickets that have some keyword / similarity match
        const matchingTickets = scoredTickets.filter(t => t.relevance.score > 0);

        // Sort descending: highest similarity score first, then by upvotes
        matchingTickets.sort((a, b) => {
            if (b.relevance.score !== a.relevance.score) {
                return b.relevance.score - a.relevance.score;
            }
            return (b.upvotes || 0) - (a.upvotes || 0);
        });

        displayedTickets = matchingTickets;
    } else {
        // Default sort: highest upvotes first
        displayedTickets = [...cachedTickets].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    const badge = document.getElementById('ticketCountBadge');
    if (badge) {
        const _t = (k, f) => (window.t ? window.t(k, f) : f);
        if (query) {
            const matchWord = displayedTickets.length === 1 
                ? _t('student.matchingReport', 'Matching Report')
                : _t('student.matchingReports', 'Matching Reports');
            badge.innerText = `${displayedTickets.length} ${matchWord}`;
        } else {
            badge.innerText = `${displayedTickets.length} ${_t('student.activeReports', 'Active Reports')}`;
        }
    }

    const _t = (k, f) => (window.t ? window.t(k, f) : f);

    if (displayedTickets.length === 0) {
        if (query) {
            container.innerHTML = `
                <div class="col-span-1 md:col-span-2 glass-card p-10 rounded-3xl text-center border border-dashed border-slate-200">
                    <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-3">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h3 class="text-lg font-black text-slate-900">${_t('student.noDuplicateFound', 'No duplicate reports found')}</h3>
                    <p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                        ${_t('student.noDuplicateDesc', 'No one has reported an issue matching this query yet. You can be the first to report it!')}
                    </p>
                    <button onclick="prefillAndOpenReport('${escapeHtml(query)}')" type="button" class="btn-gradient px-6 py-3 rounded-xl text-white font-extrabold text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span>${_t('student.reportThisIssueNow', 'Report This Issue Now')}</span>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="col-span-1 md:col-span-2 glass-card p-10 rounded-3xl text-center border border-dashed border-slate-200">
                    <p class="text-sm font-semibold text-slate-500">${_t('student.noActiveTickets', 'No active tickets at this time.')}</p>
                </div>
            `;
        }
        return;
    }

    displayedTickets.forEach((ticket, index) => {
        const card = document.createElement('article');
        card.className = "report-item glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between hover:border-blue-300 transition cursor-pointer relative overflow-hidden";
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
                        <span class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : (ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' : 'bg-slate-100 text-slate-700')}">
                            ${statusLabel}
                        </span>
                        ${ticket.faculty_endorsed ? `
                            <span class="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                                <i class="fa-solid fa-award text-purple-600 text-xs"></i> ${_t('student.facultyEndorsed', 'Faculty Endorsed')}
                            </span>
                        ` : ''}
                        ${ticket.class_in_session_active ? `
                            <span class="px-2 py-0.5 rounded-lg text-xs font-black uppercase bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1 animate-pulse">
                                <i class="fa-solid fa-bolt text-rose-600 text-[10px]"></i> ${_t('student.urgentSla', 'Urgent SLA')}
                            </span>
                        ` : ''}
                        ${isTopMatch ? `
                            <span class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 shadow-xs">
                                <i class="fa-solid fa-fire text-blue-600 animate-pulse"></i>
                                <span>${_t('student.mostSimilar', 'Most Similar Issue')}</span>
                            </span>
                        ` : (hasRelevance && ticket.relevance.score >= 20 ? `
                            <span class="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
                                <i class="fa-solid fa-check text-blue-600 text-[10px]"></i> ${_t('student.keywordMatch', 'Keyword Match')}
                            </span>
                        ` : '')}
                    </div>
                    <span class="text-xs font-semibold text-slate-400">#${ticket.id}</span>
                </div>

                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-3">
                    <div class="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        ${highlightedTitle}
                    </div>
                </div>

                <div class="p-3 rounded-2xl bg-blue-50/60 border border-blue-100/80 mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <i class="fa-solid fa-location-dot text-blue-600 text-base"></i>
                    <span>${_t('student.location', 'Location')}: <strong class="text-slate-900 font-black">${highlightedLoc}</strong></span>
                </div>

                <p class="text-sm text-slate-600 leading-relaxed">
                    ${highlightedDesc}
                </p>

                ${ticket.image_url ? `
                    <div class="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group" onclick="event.stopPropagation(); openImageViewer('${escapeHtml(ticket.image_url)}', '${escapeHtml(ticket.title)}')">
                        <img src="${ticket.image_url}" alt="Visual Proof" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md group-hover:bg-blue-600 transition-colors">
                            <i class="fa-solid fa-camera text-xs"></i> ${_t('student.initialProofPhoto', 'Initial Proof Photo')}
                        </div>
                    </div>
                ` : ''}

                ${ticket.resolved_image_url ? `
                    <div class="mt-3 relative rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 group" onclick="event.stopPropagation(); openImageViewer('${escapeHtml(ticket.resolved_image_url)}', 'Resolution Verification - ${escapeHtml(ticket.title)}')">
                        <img src="${ticket.resolved_image_url}" alt="Resolution Proof" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md text-emerald-200 text-[11px] font-black flex items-center gap-1.5 shadow-md">
                            <i class="fa-solid fa-circle-check text-emerald-400"></i> ${_t('student.afterRepairProof', 'After Repair Resolution Proof')}
                        </div>
                    </div>
                ` : ''}

                ${matchedTokens.length > 0 ? `
                    <div class="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        <span class="text-xs font-bold text-slate-400 mr-1">${_t('student.matchedKeywords', 'Matched keywords:')}</span>
                        ${matchedTokens.map(t => `<span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">${escapeHtml(t)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>

            <div class="mt-5 pt-5 border-t border-slate-200/80 flex items-center justify-between gap-4">
                <button type="button" onclick="upvoteTicket('${ticket.id}')" class="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-sm hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-2 shadow-xs group cursor-pointer">
                    <i class="fa-solid fa-arrow-up text-blue-600 group-hover:-translate-y-0.5 transition-transform"></i>
                    <span>${_t('ticket.upvote', 'Upvote')} (${ticket.upvotes || 0})</span>
                </button>
                <button type="button" onclick="shareTicket('${ticket.id}')" class="w-11 h-11 flex-shrink-0 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Live language update listener for dashboard
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

// Modal Logic
function toggleReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (modal.classList.contains('hidden')) {
            closeLaptopCamera();
        }
    }
}

// Check for pre-filled location from QR scan
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('location')) {
        toggleReportModal();
        const locInput = document.getElementById('newLocation');
        if (locInput) locInput.value = urlParams.get('location');
    }
});

function suggestTickets() {
    const locInput = document.getElementById('newLocation') ? document.getElementById('newLocation').value.trim() : '';
    const descInput = document.getElementById('newDescription') ? document.getElementById('newDescription').value.trim() : '';
    const container = document.getElementById('suggestedTicketsContainer');

    if (!container) return;

    // Only suggest if they have typed at least 3 characters in either field
    if (locInput.length < 3 && descInput.length < 3) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    // Score every cached ticket against the inputs
    const scoredCandidates = cachedTickets.map(ticket => {
        let totalScore = 0;
        const matchedTokens = new Set();

        if (locInput.length >= 2) {
            const locRel = calculateTicketRelevance(locInput, ticket);
            totalScore += locRel.score * 1.2; // Extra weight for location match
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

    // Filter tickets that have similarity score > 0
    const matching = scoredCandidates.filter(t => t.score > 0);

    if (matching.length === 0) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    // Sort descending: highest similarity score first, then upvotes
    matching.sort((a, b) => b.score - a.score || (b.upvotes || 0) - (a.upvotes || 0));

    // Display top 3 closest matches
    const topSuggestions = matching.slice(0, 3);

    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl shadow-sm mb-3">
            <div class="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-blue-100">
                <div class="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-wider">
                    <i class="fa-solid fa-lightbulb text-blue-500 text-sm"></i>
                    <span>Similar issues already reported!</span>
                </div>
                <span class="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Ranked by Similarity
                </span>
            </div>
            <p class="text-xs text-slate-600 font-medium mb-3">
                Tap <strong>Upvote</strong> on an existing report below to increase its urgency without filing a duplicate ticket:
            </p>
            <div class="space-y-2">
                ${topSuggestions.map((ticket, idx) => `
                    <div class="flex items-center justify-between p-3 bg-white/95 rounded-xl border ${idx === 0 ? 'border-blue-400 shadow-sm' : 'border-slate-100'} hover:border-blue-300 transition gap-3">
                        <div class="flex-1 min-w-0 pr-2">
                            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                                <p class="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                                    ${escapeHtml(ticket.title)}
                                </p>
                                ${idx === 0 ? `
                                    <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">Top Match</span>
                                ` : ''}
                            </div>
                            <p class="text-xs font-semibold text-slate-500 truncate flex items-center gap-1.5">
                                <i class="fa-solid fa-location-dot text-blue-600 text-[11px]"></i>
                                <span>${escapeHtml(ticket.location)}</span>
                                <span class="text-slate-300">•</span>
                                <span class="text-slate-500 font-medium">${escapeHtml(ticket.description || '').substring(0, 50)}...</span>
                            </p>
                        </div>
                        <button type="button" onclick="upvoteAndClose('${ticket.id}')" class="flex-shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-arrow-up"></i>
                            <span>Upvote (${ticket.upvotes || 0})</span>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function upvoteAndClose(ticketId) {
    await upvoteTicket(ticketId);
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
    showToast('Upvoted!', 'You successfully upvoted the existing issue instead of creating a duplicate.');
}

async function handleNewReport(event) {
    event.preventDefault();
    const category = document.getElementById('newCategory');
    const title = category ? category.value : 'Report';
    const location = document.getElementById('newLocation') ? document.getElementById('newLocation').value : '';
    const description = document.getElementById('newDescription') ? document.getElementById('newDescription').value : '';

    try {
        const payload = {
            title,
            location,
            description,
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
            showToast('Success', 'Your report has been submitted to AI Triage with visual evidence.');
            fetchTickets();
        } else {
            showToast('Error', 'Failed to submit report.', true);
        }
    } catch (err) {
        showToast('Error', 'Network error.', true);
    }
}

async function upvoteTicket(id) {
    try {
        const res = await fetchAPI(`/tickets/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ upvotes: { increment: 1 } })
        });
        if (res) {
            showToast('Upvoted', 'You endorsed this issue.');
            fetchTickets();
        }
    } catch (err) {
        console.error(err);
    }
}

let html5QrCode = null;

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
        showToast('Camera Error', 'Could not start camera. Please check permissions.');
    });
}

function closeScanner() {
    const modal = document.getElementById('qrScannerModal');
    if (modal) modal.classList.add('hidden');
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => {
            console.error("Failed to stop scanning. ", error);
        });
    }
}

function onScanSuccess(decodedText, decodedResult) {
    // Fill the location input
    const locInput = document.getElementById('newLocation');
    if (locInput) {
        // Try parsing as JSON if it's a JSON QR, otherwise use the raw text
        try {
            const data = JSON.parse(decodedText);
            locInput.value = data.room || data.location || decodedText;
        } catch (e) {
            locInput.value = decodedText;
        }
    }
    closeScanner();

    // Auto-open the report modal if not already open
    const reportModal = document.getElementById('reportModal');
    if (reportModal && reportModal.classList.contains('hidden')) {
        toggleReportModal();
    }

    showToast('QR Scanned', 'Location auto-filled from QR code.');
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning
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
        iconContainer.className = 'w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5';
        icon.className = 'fa-solid fa-check text-sm';
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    setTimeout(() => hideToast(), 3000);
}

function hideToast() {
    const toast = document.getElementById('toastNotification');
    if (toast) toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
}

// ----------------------------------------------------
// PHOTO EVIDENCE & LAPTOP CAMERA CAPTURE ENGINE
// ----------------------------------------------------
let activeCameraStream = null;
let attachedPhotoData = null;

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
        showToast('Camera Permission', 'Could not open laptop camera. You can also upload a photo file.', true);
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

    // Scale to max 1024px to balance high resolution with instant DB transfer
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

    // High quality compressed JPEG data URL
    attachedPhotoData = canvas.toDataURL('image/jpeg', 0.82);

    closeLaptopCamera();
    displayPhotoPreview(attachedPhotoData);
    showToast('Photo Captured', 'Photo attached and ready to submit.');
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
            showToast('Photo Loaded', 'Image attached to your report.');
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

// Lightbox Functions
function openImageViewer(src, title) {
    const modal = document.getElementById('imageViewerModal');
    const img = document.getElementById('imageViewerImg');
    const titleEl = document.getElementById('imageViewerTitle');

    if (img) img.src = src;
    if (titleEl) titleEl.innerText = title || 'Attached Visual Proof';
    if (modal) modal.classList.remove('hidden');
}

function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    if (modal) modal.classList.add('hidden');
}
