// Resolve API Base URL dynamically from CAMPUSOPS_CONFIG, localStorage, or environment
function getActiveApiBaseUrl() {
    if (window.CAMPUSOPS_CONFIG && window.CAMPUSOPS_CONFIG.API_BASE_URL) {
        return window.CAMPUSOPS_CONFIG.API_BASE_URL.replace(/\/+$/, '');
    }
    const stored = localStorage.getItem('CAMPUSOPS_API_URL');
    if (stored && stored.trim()) {
        return stored.trim().replace(/\/+$/, '');
    }
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.endsWith('.local');
    return isLocal ? 'http://localhost:5000/api' : '/api';
}

const API_BASE_URL = getActiveApiBaseUrl();
window.API_BASE_URL = API_BASE_URL;

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const currentBaseUrl = getActiveApiBaseUrl();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    try {
        const fullUrl = `${currentBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const response = await fetch(fullUrl, {
            ...options,
            headers
        });

        if (response.status === 401 || response.status === 403) {
            // Unauthorized or Forbidden, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            console.log('Auth bypassed or session expired');
            return null;
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error(`[CampusOps API Error] Target: ${currentBaseUrl}${endpoint}`, error);
        // If it's a TypeError from fetch, the backend is likely unreachable / sleeping on Render
        if (error instanceof TypeError && error.message.includes('fetch')) {
            error.friendlyMessage = `Cannot connect to server at ${currentBaseUrl}. If running on Render free tier, it may take 30-50s to wake up from cold start.`;
        }
        throw error;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}
