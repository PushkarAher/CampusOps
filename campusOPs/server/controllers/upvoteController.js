const supabase = require('../config/supabaseClient');

const upvoteTicket = async (req, res) => {
    const { id } = req.params;
    
    // Fetch current upvotes first or use an RPC in Supabase to increment safely
    // For simplicity, assuming a stored procedure 'increment_upvotes' exists
    const { data, error } = await supabase.rpc('increment_upvotes', { ticket_id: id });
    
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Upvoted successfully', data });
};

module.exports = {
    upvoteTicket
};
