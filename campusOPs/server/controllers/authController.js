const login = async (req, res) => {
    const { email, password } = req.body;
    // Mock successful login without forcing 'Admin' role, so frontend uses selected role
    res.status(200).json({
        session: { access_token: 'mock_token_123' },
        user: { user_metadata: { email } } 
    });
};

const getRole = async (req, res) => {
    res.status(200).json({ role: 'Admin' });
};

const register = async (req, res) => {
    const { email, password, role, ...metadata } = req.body;
    // Mock successful registration
    res.status(201).json({
        session: { access_token: 'mock_token_123' },
        user: { user_metadata: { role, email, ...metadata } }
    });
};

const getMe = async (req, res) => {
    res.status(200).json({
        role: 'Admin',
        fullName: 'Demo User',
        email: 'demo@example.com'
    });
};

module.exports = {
    login,
    register,
    getRole,
    getMe
};
