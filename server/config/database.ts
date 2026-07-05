import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local');
}

// Override WebSocket for Node.js 20
(globalThis as any).WebSocket = ws;

// Create client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: fetch,
  },
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Database initialization
export const initializeDatabase = async () => {
  try {
    // Test if users table exists
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    // Log the actual error for debugging
    if (error) {
      console.log("🔍 Error details:", {
  code: error.code,
  message: error.message,
  details: error.details,
  hint: error.hint,
});
    }
    
    if (error && (error.code === 'PGRST205' || error.code === 'PGRST116' || error.message?.includes('Could not find the table'))) {
      console.log('\n');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📋 DATABASE SETUP REQUIRED');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
      console.log('🔧 The required database tables are not created yet.');
      console.log('');
      console.log('Quick Setup (2 minutes):');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Open your project');
      console.log('3. Click "SQL Editor" in the left sidebar');
      console.log('4. Click "New query" button');
      console.log('5. Copy and paste the SQL from: BACKEND_SETUP.md');
      console.log('6. Click "Run" button');
      console.log('7. Refresh your browser');
      console.log('');
      console.log('Project ID: tfgucnuzupieroplvpyy');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
      return;
    }
    
    if (error) {
      console.log('📋 Database connection: ' + error.message);
      return;
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('⚠️  Database initialization error:', error);
  }
};
