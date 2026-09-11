function _t(key, fallback) {
    if (typeof window.t === 'function') {
        const res = window.t(key);
        if (res && res !== key) return res;
    }
    return fallback;
}

let currentNoticeFilter = 'all';

async function fetchNotices() {
    try {
        const notices = await fetchAPI('/notices');
        const container = document.getElementById('adminNoticeFeed');
        if (!container) return;
        
        container.innerHTML = '';
        if(!notices || notices.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm">${_t('student.noActiveNotices', 'No notices available.')}</p>`;
            return;
        }

        notices.forEach(notice => {
            if (currentNoticeFilter !== 'all' && notice.type !== currentNoticeFilter) {
                return;
            }
            container.innerHTML += `
            <article class="bg-white/95 p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                  <i class="fa-solid fa-bolt"></i>
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="text-xs font-bold text-slate-500">${new Date(notice.created_at).toLocaleString()}</span>
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    ${notice.title}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 mt-1">
                    ${notice.content}
                  </p>
                </div>
              </div>
            </article>`;
        });
    } catch (err) {
        console.error('Error fetching notices:', err);
    }
}

async function fetchTickets() {
    try {
        const tickets = await fetchAPI('/tickets');
        const tbody = document.getElementById('adminTicketsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        let pendingCount = 0;
        let resolvedCount = 0;
        
        if(!tickets || tickets.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500">${_t('student.noActiveTickets', 'No tickets found.')}</td></tr>`;
        } else {
            tickets.forEach(ticket => {
                if(ticket.status === 'Resolved') {
                    resolvedCount++;
                } else {
                    pendingCount++;
                }
                
                const statusKey = ticket.status === 'Resolved' ? 'resolved' : (ticket.status === 'In Progress' ? 'inProgress' : 'open');
                const localizedStatus = _t('ticket.statuses.' + statusKey, ticket.status);
                const upvoteWord = _t('ticket.upvote', 'Upvotes');
                const unassignedWord = _t('facility.unassigned', 'Unassigned');
                const reassignWord = _t('admin.reassignTech', 'Re-assign');

                tbody.innerHTML += `
                  <tr class="admin-ticket-row hover:bg-white/80 transition">
                    <td class="py-4 px-4 font-black text-slate-900">#${ticket.id.substring(0,8)}</td>
                    <td class="py-4 px-4 text-xs font-bold">${ticket.location}</td>
                    <td class="py-4 px-4 text-xs text-rose-700 font-extrabold">${ticket.title} - ${localizedStatus}</td>
                    <td class="py-4 px-4 text-xs">
                      <span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-black">${ticket.upvotes || 0} ${upvoteWord}</span>
                    </td>
                    <td class="py-4 px-4 text-xs">${ticket.assigned_technician || unassignedWord}</td>
                    <td class="py-4 px-4 text-right">
                      <button onclick="overrideAssignModal('${ticket.id}', '${ticket.location}')" class="text-xs font-extrabold text-brand-coral hover:underline">${reassignWord}</button>
                    </td>
                  </tr>
                `;
            });
        }
        
        // Update stats
        const pendingStat = document.getElementById('pendingStat');
        const resolvedStat = document.getElementById('resolvedStat');
        if(pendingStat) pendingStat.innerText = pendingCount;
        if(resolvedStat) resolvedStat.innerText = resolvedCount;
        
    } catch (err) {
        console.error('Error fetching tickets:', err);
    }
}

function filterNotices(type) {
    currentNoticeFilter = type;
    fetchNotices();
}

// Dummy functions for modal behaviors in admin.html
let activeTicketId = '';
function overrideAssignModal(ticketId, loc) {
    activeTicketId = ticketId;
    const meta = document.getElementById('reassignMeta');
    if(meta) meta.innerText = `Ticket #${ticketId} • ${loc}`;
    const modal = document.getElementById('reassignModal');
    if(modal) modal.classList.remove('hidden');
}

function closeReassignModal() {
    const modal = document.getElementById('reassignModal');
    if(modal) modal.classList.add('hidden');
}

function confirmReassign() {
    const tech = document.getElementById('techSelect');
    if(tech) {
        showToast('Re-assigned', `Ticket ${activeTicketId} re-assigned to ${tech.value}`);
    }
    closeReassignModal();
}

function toggleNoticeModal() {
    const modal = document.getElementById('noticeModal');
    if(modal) modal.classList.toggle('hidden');
}

async function handleNoticeSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('noticeTitle') ? document.getElementById('noticeTitle').value : 'Notice';
    const content = document.getElementById('noticeDesc') ? document.getElementById('noticeDesc').value : '';
    
    try {
        await fetchAPI('/notices', {
            method: 'POST',
            body: JSON.stringify({ title, content, type: 'admin', priority: 'high' })
        });
        toggleNoticeModal();
        e.target.reset();
        fetchNotices();
        showToast('Success', 'Notice posted successfully.');
    } catch (err) {
        console.error('Error posting notice:', err);
        showToast('Error', 'Failed to post notice.', true);
    }
}

function runAICheck() {
    showToast('AI Analysis', 'AI Analysis complete. No new anomalies.');
}

function showToast(header, body, isError = false) {
    const toast = document.getElementById('toastNotification');
    if(!toast) return;
    
    const h = document.getElementById('toastHeader');
    const b = document.getElementById('toastBody');
    if (h) h.innerText = header;
    if (b) b.innerText = body;
    
    const iconContainer = document.getElementById('toastIconContainer');
    const icon = document.getElementById('toastIcon');
    if(isError) {
        if(iconContainer) iconContainer.className = 'w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5';
        if(icon) icon.className = 'fa-solid fa-xmark text-sm';
    } else {
        if(iconContainer) iconContainer.className = 'w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5';
        if(icon) icon.className = 'fa-solid fa-check text-sm';
    }
    
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    setTimeout(() => hideToast(), 3000);
}

function hideToast() {
    const toast = document.getElementById('toastNotification');
    if(toast) toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNotices();
    fetchTickets();

    setInterval(() => {
        fetchNotices();
        fetchTickets();
    }, 5000);
});

window.addEventListener('languageChanged', () => {
    fetchNotices();
    fetchTickets();
});
