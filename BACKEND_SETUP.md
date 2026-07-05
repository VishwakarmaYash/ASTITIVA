# Vault E-Commerce Backend Setup Guide

## ✅ What's Been Created

Your backend infrastructure includes:
- **Express API Server** with routes for auth, products, cart, orders, and wishlist
- **Supabase Database** integration for persistent data storage
- **JWT Authentication** for user sessions
- **Stripe Payment Integration** for checkout
- **TypeScript** for type safety across the stack

---

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```

This installs all new packages including:
- `@supabase/supabase-js` - Database client
- `stripe` - Payment processing
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Auth tokens
- `cors` - Cross-origin support
- `concurrently` - Run frontend & backend together

---

### Step 2: Set Up Supabase Database

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up and create a new project
   - Wait for project initialization (2-3 minutes)

2. **Get Your Credentials**
   - In Supabase dashboard, go to **Project Settings > API**
   - Copy your **Project URL** and **Anon Key**
   - Add these to `.env.local`:
     ```
     VITE_SUPABASE_URL=your-project-url-here
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

3. **Initialize Database Tables**
   - The backend will auto-create tables on first run
   - Or manually run the SQL in Supabase SQL Editor if needed

---

### Step 3: Set Up Stripe (Optional for Testing)

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Create account and enable test mode

2. **Get API Keys**
   - Go to **Developers > API Keys**
   - Copy **Publishable Key** and **Secret Key**
   - Add to `.env.local`:
     ```
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_PUBLISHABLE_KEY=pk_test_...
     ```

3. **Set Up Webhook** (Production only)
   - This is optional for development

---

### Step 4: Complete `.env.local` File

Copy this template and fill in your credentials:

```env
# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:3000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Backend
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (optional for dev)
```

---

### Step 5: Run the Application

**Option A: Run Frontend Only** (for testing without backend)
```bash
npm run dev
```

**Option B: Run Frontend + Backend Together**
```bash
npm run dev:all
```

**Option C: Run Backend Only**
```bash
npm run dev:server
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders/checkout` - Create checkout session
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

---

## 🔌 Frontend Integration

The frontend now has an API client in `src/api/client.ts` with all endpoints:

```typescript
import { authAPI, cartAPI, ordersAPI } from './api/client';

// Login
const { token } = await authAPI.login('user@example.com', 'password');
localStorage.setItem('vault_auth_token', token);

// Get products
const products = await productsAPI.getAll();

// Add to cart
await cartAPI.add('product-id', 'M', 1);

// Checkout
const { sessionId } = await ordersAPI.checkout(cart, address);
```

---

## 🛠️ Database Schema

Your Supabase database includes:

### users
- `id` - UUID
- `email` - Unique user email
- `password_hash` - Hashed password
- `first_name`, `last_name` - Name fields
- `phone`, `address`, `city`, `country`, `postal_code` - Address info
- `created_at`, `updated_at` - Timestamps

### products
- `id` - Product ID
- `name`, `price`, `description` - Product info
- `image`, `category` - Display data
- `features[]`, `specs[]`, `sizes[]` - Product details
- `inventory` - Stock count

### cart_items
- Links users to products with size and quantity

### orders
- Main order record with total, status, payment info

### order_items
- Individual items within each order

### wishlist
- User saved products

---

## ⚠️ Next Steps

1. **Seed Product Database**
   - Currently hardcoded in frontend
   - Run this in Supabase SQL to add your products:
   ```sql
   INSERT INTO products (id, name, price, description, category, image, color_code, features, specs, sizes, inventory)
   VALUES ('kinetic-shell', 'KINETIC SHELL', 540, '...', 'Jackets', '...', 'WHITE / 01', '{}', '{}', '{}', 100);
   ```

2. **Frontend Authentication UI**
   - Add login/register forms
   - Store token in localStorage
   - Add protected routes

3. **Payment Completion**
   - Handle Stripe redirect after payment
   - Update order status on payment success
   - Add order confirmation page

4. **Admin Dashboard**
   - Create admin routes
   - Manage products, inventory, orders
   - View analytics

5. **Deployment**
   - Deploy backend to Heroku, Railway, or similar
   - Deploy frontend to Vercel or Netlify
   - Update API URLs in production

---

## 🐛 Troubleshooting

**"Cannot find module"**
- Run `npm install` again
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

**"Supabase connection failed"**
- Check `.env.local` credentials
- Verify Supabase project is active
- Check firewall/VPN isn't blocking connection

**"Stripe payment not working"**
- Verify Stripe keys in `.env.local`
- Use test card: `4242 4242 4242 4242`

---

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs/api
- Express.js: https://expressjs.com
- TypeScript: https://www.typescriptlang.org

---

**Ready to run?** Start with:
```bash
npm install
npm run dev:all
```

Then check http://localhost:3000 for frontend and http://localhost:3001 for backend API.
