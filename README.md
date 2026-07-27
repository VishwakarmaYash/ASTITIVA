
# 🌌 ASTITIVA (Formerly Vault)

### Ultra-Premium Futuristic Technical Streetwear E-Commerce Platform
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-indigo.svg)](https://stripe.com/)

[**Live Storefront**](https://www.astitiva.store/) 

</div>

---

## 📖 Introduction

**Astitiva** (formerly known as **Vault**) is an ultra-premium, highly aesthetic technical streetwear e-commerce platform showcasing the futuristic **Glacier winter collection**. The platform is meticulously divided into two separate portals:
1. **Interactive Public Storefront (`src/website`)**: An immersive e-commerce experience including apparel customization studios, search, interactive cart drawers, custom design panels, wishlists, and seamless payment workflows.
2. **Role-Protected Admin Panel (`src/admin`)**: A high-tech analytical dashboard for inventory management, real-time sales metrics, customer profiles, and interactive announcement banner management.

---

## 🛠️ Tech Stack & Key Technologies

### Frontend
- **Framework**: [React 19](https://react.dev/) (featuring modern state management and hooks)
- **Build Tool**: [Vite 6](https://vite.dev/) (for sub-second fast-refresh compilation)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion) for premium fluid micro-interactions
- **Icons**: [Lucide React](https://lucide.dev/) for high-fidelity icons
- **Data Visualization**: [Recharts](https://recharts.org/) for highly interactive charts in the admin dashboard

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Server Framework**: [Express](https://expressjs.com/) with CORS protection
- **Execution Engine**: [tsx](https://github.com/privatenumber/tsx) for seamless on-the-fly TypeScript watch-compiling
- **Database**: [Supabase](https://supabase.com/) PostgreSQL database with complete relational client SDK
- **Authentication**: JWT (JSON Web Tokens) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) secure hashing
- **Payments**: [Stripe](https://stripe.com/) SDK (checkout sessions generation)
- **Mailing**: [Resend](https://resend.com/) SDK (email automation)
- **AI Integrations**: Server-side [Google Gemini API](https://ai.google.dev/) capabilities

---

## ✨ Features Breakdown

### 🛒 Immersive Storefront (`src/website`)
- **Cyberpunk / Glacial Aesthetic**: Translucent blur backdrops, sleek glowing neon borders, and dark ambient design.
- **Custom Studio**: An interactive, dynamic customization suite enabling users to personalize color schemes, technical decals, sizes, and specific modifications on outerwear or accessories.
- **Dynamic Shopping Cart Drawer**: Micro-animated checkout queue supporting instant modifications, size selectors, and precise totals.
- **Product Details Drawer**: Deep-dives into features, specifications, size guidelines, and full-bleed image carousels.
- **Universal Search & Filtering**: Multi-parameter search system instantly filtering products by category and keywords.
- **Secure Authentication & Profiling**: Quick registration, JWT-based login, and user profiles detailing transaction histories.
- **Interactive Promotions**: Floating promo ticket components, newsletter opt-ins, and contextual promo code alerts.

### 📊 Protection-Locked Admin Panel (`src/admin`)
Served at `/admin` (requires active JWT session with an `admin` role in `localStorage`):
- **Dashboard / Analytics**: Real-time sales charts, orders tracking, customer counts, performance metrics, and product revenue rankings.
- **Product Management**: Create, Read, Update, and Delete (CRUD) operations on inventory items, customized sizes, descriptions, pricing, and high-tech specs.
- **Order Tracking**: Comprehensive view of fulfillment status (e.g., Pending, Processing, Shipped, Delivered) with easy status change triggers.
- **Customer Directory**: Central repository containing emails, registered user lists, and role management widgets.
- **Banners & Coupons Studio**: Operational dashboard to edit primary announcement tickers, flash-sale discount parameters, and direct coupons.

---

## 📂 Project Architecture

```
.
├── public/                 # Static assets & graphic illustrations
├── server/                 # Express Backend Server (TypeScript)
│   ├── config/             # Database connection & Supabase configuration
│   ├── middleware/         # Authentication & permission verification gates
│   ├── models/             # Schema mapping models
│   ├── routes/             # RESTful Router definitions (Auth, Products, Cart, Orders, Banners, Shipping)
│   └── index.ts            # Entrypoint file starting the Express REST API
├── src/                    # React Frontend
│   ├── admin/              # Admin Panel Dashboard Portal
│   │   ├── components/     # Specialized analytics, banner edit tabs, order tables
│   │   └── App.tsx         # Dashboard core layout
│   ├── api/                # Axios-style API Client mapping endpoints
│   ├── website/            # Core Public Storefront
│   │   ├── components/     # Glacial orb widgets, custom studio, cart drawers
│   │   └── WebsiteApp.tsx  # Storefront layout controller
│   ├── App.tsx             # Root website entry pointer
│   ├── Roots.tsx           # React-Router role-based security configurations
│   ├── index.css           # Global Tailwind CSS configurations
│   └── main.tsx            # Main DOM Renderer
├── index.html              # HTML core shell
├── package.json            # Node scripts, dependencies, build settings
└── tsconfig.json           # Type definitions compiler specifications
```

---

## 🚀 Run & Configure Locally

### Prerequisites
- **Node.js** (v18+ recommended)
- **Supabase Account** (for SQL database structure)
- **Stripe Account** (optional for checkout processing)

---

### Step 1: Install Dependencies
Install packages for both frontend and backend concurrently:
```bash
npm install
```

---

### Step 2: Configure Environment Variables
Create a file named `.env.local` in the project root directory:

```env
# Server Configuration
PORT=3001
JWT_SECRET=your-super-secure-key-at-least-32-characters-long

# Backend Database Config (Supabase)
DATABASE_URL=your-supabase-connection-string
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Integration (Optional)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Studio Credentials
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend Application Connections
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:5173
```

---

### Step 3: Run the Application

You can launch the front-end, backend, or both simultaneously using predefined npm scripts:

* **Option A: Run Frontend + Backend Together (Recommended)**
  ```bash
  npm run dev:all
  ```
  - Frontend starts at: `http://localhost:5173`
  - Backend starts at: `http://localhost:3001`
  - Admin Dashboard is located at: `http://localhost:5173/admin` (Requires setting your customer role to `admin`)

* **Option B: Run Frontend Only**
  ```bash
  npm run dev
  ```

* **Option C: Run Backend Only**
  ```bash
  npm run dev:server
  ```

---

## 📝 API Endpoints Summary

For an exhaustive guide, please check out the complete [API Reference Docs](./API_REFERENCE.md).

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register an account | No |
| **POST** | `/api/auth/login` | Secure JWT Login | No |
| **GET** | `/api/auth/me` | Fetch active profile | **Yes (Bearer Token)** |
| **GET** | `/api/products` | Retrieve catalog items | No |
| **GET** | `/api/products/:id` | Fetch product details | No |
| **GET** | `/api/cart` | Fetch user's cart | **Yes (Bearer Token)** |
| **POST** | `/api/cart/add` | Add items to cart | **Yes (Bearer Token)** |
| **DELETE**| `/api/cart/:itemId` | Remove an item from cart | **Yes (Bearer Token)** |
| **POST** | `/api/orders/checkout`| Initialize Stripe session | **Yes (Bearer Token)** |
| **GET** | `/api/wishlist` | Retrieve saved items | **Yes (Bearer Token)** |

---

## 🎨 Admin Access Instructions
To bypass the route guard and test the `/admin` portal locally:
1. Register a standard account via the storefront profile page.
2. Manually alter the role of your created user profile in your database manager (or set `vault_user_role` to `"admin"` and `vault_auth_token` directly in your browser's local storage for swift dev visual checks).
3. Navigate to `/admin`.

---

## 💡 Troubleshooting & Tips

- **TypeScript Errors:** If you encounter compilation discrepancies, type-check with:
  ```bash
  npm run lint
  ```
- **Supabase Connectivity:** If you notice cart, auth, or order latency, ensure your project state in Supabase is not paused.
- **Port Conflicts:** If ports `5173` or `3001` are already bound, release them before starting the server:
  ```bash
  kill $(lsof -t -i :3001) 2>/dev/null || true
  kill $(lsof -t -i :5173) 2>/dev/null || true
  ```

---

<div align="center">
Designed with 🌌 for Astitiva E-Commerce.
</div>
