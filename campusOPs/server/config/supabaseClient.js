require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey) {
    const { createClient } = require('@supabase/supabase-js');
    const realSupabase = createClient(supabaseUrl, supabaseKey);

    const mockSupabase = {
        auth: realSupabase.auth,
        from: (table) => realSupabase.from(table),
        rpc: (fn, args) => realSupabase.rpc(fn, args)
    };
    
    module.exports = mockSupabase;
} else {
    console.warn('Missing Supabase credentials. USING IN-MEMORY MOCK DATABASE.');
    
    // In-memory mock database
    const db = {
        tickets: [],
        notices: [
            { id: 1, title: 'Welcome to CampusOps', content: 'System initialized.', type: 'admin', created_at: new Date().toISOString() }
        ],
        comments: []
    };

    let ticketIdCounter = 1000;
    let noticeIdCounter = 100;
    let commentIdCounter = 500;

    const mockSupabase = {
        auth: {
            signInWithPassword: async ({ email, password }) => {
                let role = 'Student';
                if (email.includes('teacher')) role = 'Teacher';
                if (email.includes('admin')) role = 'Admin';
                if (email.includes('facility')) role = 'Facility';
                
                return {
                    data: {
                        session: { access_token: `mock-token-${role}` },
                        user: { id: 'mock-user-1', email, user_metadata: { role } }
                    },
                    error: null
                };
            },
            getUser: async (token) => {
                if (token.startsWith('mock-token-')) {
                    const role = token.split('-')[2];
                    return {
                        data: {
                            user: { id: 'mock-user-1', email: 'mock@test.com', user_metadata: { role } }
                        },
                        error: null
                    };
                }
                return { data: null, error: { message: 'Invalid mock token' } };
            }
        },
        from: (table) => {
            return {
                select: (columns) => {
                    return {
                        eq: async (col, val) => {
                            return { data: db[table].filter(row => row[col] == val), error: null };
                        },
                        then: (resolve) => resolve({ data: db[table], error: null })
                    };
                },
                insert: (rows) => {
                    const returnData = rows.map(r => {
                        let id = ++ticketIdCounter;
                        if (table === 'tickets') id = `TCK-${ticketIdCounter}`;
                        else if (table === 'notices') id = ++noticeIdCounter;
                        else if (table === 'comments') id = ++commentIdCounter;
                        
                        const newRow = { ...r, id, created_at: new Date().toISOString() };
                        if(table === 'tickets') newRow.upvote_count = 0;
                        db[table].push(newRow);
                        return newRow;
                    });
                    return {
                        select: async () => ({ data: returnData, error: null })
                    };
                },
                update: (updates) => {
                    return {
                        eq: (column, value) => {
                            let updatedRows = [];
                            db[table] = db[table].map(row => {
                                if (row[column] == value) {
                                    // Handle increment for upvotes
                                    let actualUpdates = { ...updates };
                                    if(updates.upvote_count !== undefined && typeof updates.upvote_count === 'object' && updates.upvote_count.increment) {
                                        actualUpdates.upvote_count = (row.upvote_count || 0) + updates.upvote_count.increment;
                                    }
                                    const updated = { ...row, ...actualUpdates };
                                    updatedRows.push(updated);
                                    return updated;
                                }
                                return row;
                            });
                            return {
                                select: async () => ({ data: updatedRows, error: null })
                            };
                        }
                    };
                }
            };
        }
    };
    
    module.exports = mockSupabase;
}
