const supabase = require('../config/supabaseClient');

const verifyToken = async (req, res, next) => {
    // Mock user so all routes work
    req.user = { id: 'mock-id', user_metadata: { role: 'Admin', name: 'Admin User' } };
    next();
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Always allow
        next();
    };
};

module.exports = {
    verifyToken,
    checkRole
};
