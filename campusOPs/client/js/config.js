// ==============================================================================
// CampusOps Dynamic Environment & API Configuration
// ==============================================================================
// This file centralizes the API Base URL so the frontend can run seamlessly
// on localhost, Vercel, or any custom domain without hardcoding.
//
// HOW IT WORKS:
// 1. Localhost: Automatically points to 'http://localhost:5000/api'
// 2. Production (Vercel):
//    - Reads from localStorage ('CAMPUSOPS_API_URL') if set by user or admin
//    - Or falls back to window.DEFAULT_PRODUCTION_API_URL
//    - Or if hosted with Vercel rewrites (see vercel.json), defaults to '/api'
// 3. Runtime Override: You can call window.setCampusOpsApiUrl("https://your-render.onrender.com/api")
//    in the browser console or use the UI config gear on login.html.
// ==============================================================================

(function () {
  'use strict';

  // Set your Render backend deployment URL here (e.g., 'https://campusops-backend.onrender.com/api')
  // If you use Vercel rewrites in vercel.json, you can keep this as '/api'.
  const DEFAULT_PRODUCTION_API_URL = 'https://campusops-backend.onrender.com/api';

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  function determineApiBaseUrl() {
    // 1. Manual runtime override saved in browser storage
    const storedUrl = localStorage.getItem('CAMPUSOPS_API_URL');
    if (storedUrl && storedUrl.trim()) {
      return storedUrl.trim().replace(/\/+$/, '');
    }

    // 2. Custom injected global (if set via inline script or build step)
    if (window.__CAMPUSOPS_API_URL__ && window.__CAMPUSOPS_API_URL__.trim()) {
      return window.__CAMPUSOPS_API_URL__.trim().replace(/\/+$/, '');
    }

    // 3. Local development environment
    if (isLocalhost) {
      return 'http://localhost:5000/api';
    }

    // 4. Production deployment fallback
    return (DEFAULT_PRODUCTION_API_URL || '/api').replace(/\/+$/, '');
  }

  // Export to global window object
  window.CAMPUSOPS_CONFIG = {
    isLocalhost,
    API_BASE_URL: determineApiBaseUrl(),
    DEFAULT_PRODUCTION_API_URL
  };

  /**
   * Helper function to change the API URL on the fly without code edits.
   * @param {string} newUrl - e.g. "https://my-backend.onrender.com/api"
   */
  window.setCampusOpsApiUrl = function (newUrl) {
    if (!newUrl || !newUrl.trim()) {
      localStorage.removeItem('CAMPUSOPS_API_URL');
      window.CAMPUSOPS_CONFIG.API_BASE_URL = determineApiBaseUrl();
      console.log('[CampusOps Config] Reset API URL to default:', window.CAMPUSOPS_CONFIG.API_BASE_URL);
    } else {
      const sanitized = newUrl.trim().replace(/\/+$/, '');
      localStorage.setItem('CAMPUSOPS_API_URL', sanitized);
      window.CAMPUSOPS_CONFIG.API_BASE_URL = sanitized;
      console.log('[CampusOps Config] Successfully updated API URL to:', sanitized);
    }
  };

  console.log(
    `%c[CampusOps]%c Active API Base URL: %c${window.CAMPUSOPS_CONFIG.API_BASE_URL}`,
    'background: #2563eb; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
    'color: #64748b; font-weight: bold;',
    'color: #059669; font-weight: bold;'
  );
})();
