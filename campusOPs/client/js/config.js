// ==============================================================================
// CampusOps Dynamic Environment & API Configuration
// ==============================================================================
// This file centralizes the API Base URL so the frontend can run seamlessly
// on localhost, Vercel, or any custom domain without hardcoding.
//
// HOW IT WORKS:
// 1. Localhost: Automatically points to 'http://localhost:5000/api'
// 2. Production (Vercel / any host): Automatically uses the Render backend below.
//    No manual entry or prompt is ever shown to the user.
// ==============================================================================

(function () {
  'use strict';

  // ─── PINNED BACKEND URL ────────────────────────────────────────────────────
  // This is the deployed Render backend. It is used automatically — users are
  // never asked to enter anything. Change this value if you redeploy the backend.
  const PRODUCTION_API_URL = 'https://campusops1.onrender.com/api';

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  function determineApiBaseUrl() {
    // Local development always points to the local server
    if (isLocalhost) {
      return 'http://localhost:5000/api';
    }
    // Production: always use the pinned Render URL — no localStorage, no prompt
    return PRODUCTION_API_URL;
  }

  const activeUrl = determineApiBaseUrl();

  // Clear any stale user-entered URL from a previous session so it never
  // interferes with the pinned production URL above.
  if (!isLocalhost) {
    localStorage.removeItem('CAMPUSOPS_API_URL');
  }

  // Export to global window object
  window.CAMPUSOPS_CONFIG = {
    isLocalhost,
    API_BASE_URL: activeUrl,
    DEFAULT_PRODUCTION_API_URL: PRODUCTION_API_URL
  };

  /**
   * Helper kept for backwards-compatibility (used internally by api.js).
   * In production this now always returns the pinned Render URL.
   */
  window.setCampusOpsApiUrl = function (newUrl) {
    if (isLocalhost && newUrl && newUrl.trim()) {
      const sanitized = newUrl.trim().replace(/\/+$/, '');
      localStorage.setItem('CAMPUSOPS_API_URL', sanitized);
      window.CAMPUSOPS_CONFIG.API_BASE_URL = sanitized;
      console.log('[CampusOps Config] (localhost) API URL overridden to:', sanitized);
    } else {
      console.log('[CampusOps Config] Production URL is pinned; override ignored.');
    }
  };

  console.log(
    `%c[CampusOps]%c Active API: %c${window.CAMPUSOPS_CONFIG.API_BASE_URL}`,
    'background: #2563eb; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
    'color: #64748b; font-weight: bold;',
    'color: #059669; font-weight: bold;'
  );
})();
