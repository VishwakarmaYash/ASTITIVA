import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
import { initTables } from '../utils/initTables';
import { PRODUCTS } from '../../src/website/data';

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
    // Run schema initialization checks
    const tablesReady = await initTables();
    if (!tablesReady) {
      console.log('⚠️ Database schema verification failed or manual setup required.');
      return;
    }

    // Fetch existing product IDs from the database
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id');

    if (prodError) {
      console.error('⚠️ Failed to check products table for seeding:', prodError.message);
      return;
    }

    // Seed missing products if any (development only)
    const existingIds = (products || []).map((p: any) => p.id);
    const missingProducts = PRODUCTS.filter((p) => !existingIds.includes(p.id));

    if (missingProducts.length > 0 && process.env.NODE_ENV !== 'production') {
      console.log(`📋 Seeding products table with ${missingProducts.length} missing product(s)...`);
      const seedData = missingProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        color_code: p.colorCode,
        category: p.category,
        image: p.image,
        features: p.features,
        specs: p.specs,
        sizes: p.sizes,
        inventory: 100,
        images: p.images || [],
      }));

      const { error: insertError } = await supabase
        .from('products')
        .insert(seedData);

      if (insertError) {
        console.error('❌ Seeding failed:', insertError.message);
      } else {
        console.log(`✅ Seeding completed successfully (${missingProducts.length} product(s) loaded).`);
      }
    } else {
      console.log('✅ Products already seeded.');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('⚠️  Database initialization error:', error);
  }
};
