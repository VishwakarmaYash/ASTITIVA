import { supabase } from '../config/database';

export const initTables = async () => {
  try {
    // Check if users table exists
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (usersError && usersError.code === 'PGRST116') {
      console.log('📋 Creating database tables...');
      
      // Create tables using raw SQL through the API
      // Note: This approach uses the auto-create feature of Supabase
      // Tables will be created on first insert/update/select if schema allows
      
      // Test creating users table by attempting an insert and catching error
      const testUser = {
        id: 'test-' + Date.now(),
        email: 'test@example.com',
        password_hash: 'test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert([testUser]);

      if (insertError && insertError.code !== '23505') { // 23505 is duplicate key error
        console.error('❌ Cannot auto-create tables. Error:', insertError);
        console.log('\n💡 Manual Setup Required:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Open your project (ID: tfgucnuzupieroplvpyy)');
        console.log('3. Go to SQL Editor');
        console.log('4. Run this SQL:');
        console.log(getSql());
        return false;
      }

      // Clean up test record
      if (insertError?.code === '23505') {
        // Try to delete test record if it exists
        await supabase.from('users').delete().eq('id', testUser.id);
      }

      console.log('✅ Database tables ready');
      return true;
    }

    console.log('✅ Database tables already exist');
    return true;
  } catch (error) {
    console.error('⚠️  Error initializing tables:', error);
    return false;
  }
};

function getSql() {
  return `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  color_code TEXT,
  category TEXT,
  image TEXT,
  features TEXT[],
  specs TEXT[],
  sizes TEXT[],
  inventory INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  size TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDDHHMMSS'),
  user_id UUID NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
`;
}
