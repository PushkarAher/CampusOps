const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase credentials not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
    console.log('Creating Admin Demo User...');
    
    // Check if user exists by trying to log in first
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'estate.office@campus.edu',
        password: 'password123'
    });

    if (loginData?.user) {
        console.log('Admin user already exists!');
        process.exit(0);
    }

    const { data, error } = await supabase.auth.signUp({
        email: 'estate.office@campus.edu',
        password: 'password123',
        options: {
            data: {
                role: 'Admin', // In authController 'Estate Admin' check is used? Let's check api.js: rbac.checkRole(['Estate Admin'])
                fullName: 'Dr. V. K. Deshmukh',
                employeeId: 'ADMIN-01',
                adminLevel: 'Chief Estate & Operations Officer'
            }
        }
    });

    if (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }

    console.log('Successfully created Admin user:', data.user.email);
}

createAdminUser();
