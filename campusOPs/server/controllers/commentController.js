const supabase = require('../config/supabaseClient');

const getComments = async (req, res) => {
    const { ticketId } = req.params;
    const { data, error } = await supabase.from('comments').select('*').eq('ticket_id', ticketId);
    if (error) return res.status(500).json({ error: error.message });
    // Transform back for frontend
    const transformedData = (data || []).map(d => ({ ...d, ticketId: d.ticket_id, text: d.content, author: d.author_role }));
    res.status(200).json(transformedData);
};

const addComment = async (req, res) => {
    const { ticketId } = req.params;
    const { text, author } = req.body;
    const { data, error } = await supabase.from('comments').insert([{ ticket_id: ticketId, content: text, author_role: author }]).select();
    if (error) return res.status(500).json({ error: error.message });
    // Transform back for frontend
    const transformedData = data.map(d => ({ ...d, ticketId: d.ticket_id, text: d.content, author: d.author_role }));
    res.status(201).json(transformedData);
};

module.exports = {
    getComments,
    addComment
};
