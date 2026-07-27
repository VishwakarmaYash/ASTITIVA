<div align="center">
<img width="1200" height="475" alt="Astitiva Streetwear E-Commerce" src="https://www.astitiva.store/images/astitva_hero_banner.jpg" onerror="this.src='https://ai.google.dev/static/site-assets/images/share-ais-513315318.png'" />
</div>

# Astitiva - Ultra-Premium Streetwear E-Commerce Storefront

Astitiva (अस्तित्व - meaning *existence* or *identity*) is a next-generation, high-end futuristic technical streetwear e-commerce platform. It features the **Glacier winter collection**, custom 1-of-1 apparel creation, interactive shopping mechanisms, and a solid full-stack architecture.

Explore the live site: [https://www.astitiva.store/](https://www.astitiva.store/)

---

## ✨ Features

- **Dynamic Interactive UI:** Highly responsive, neobrutalist, and fluid interface powered by Tailwind CSS v4, Framer Motion, and React 19.
- **Custom Print Studio:** An innovative 1-of-1 custom builder that allows users to design their own t-shirts or hoodies with real-time preview (placement, custom text, font family, text colors) and seamless cart addition.
- **Smart Promo Popup & Coupons:** Interactive promotional banner overlays and copyable coupon ticket systems designed to maximize user engagement.
- **Secure Authentication:** Robust sign-up and sign-in functionality with JSON Web Tokens (JWT) and Bcrypt hashing.
- **Cart & Wishlist Systems:** Full persistent client-state and server-synchronized shopping cart and wishlist management.
- **Integrated Checkout:** Streamlined order processing with optional Stripe payment processor flow.
- **Comprehensive Admin Console:** Dedicated dashboard for administrative tasks, product management, active campaigns, banner updates, and system tracking.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Component-based interactive UI
- **TypeScript** - Full static typing
- **Vite** - Lightning-fast frontend build tooling
- **Tailwind CSS v4** - Next-generation responsive styling and utility-first design
- **Framer Motion** - Silky-smooth micro-animations
- **Lucide React** - High-quality clean SVG icon library

### Backend
- **Express.js** - Robust Node.js API server
- **Supabase** - Serverless PostgreSQL database client and secure hosting
- **Stripe** - Premium merchant payments and checkout session APIs
- **JWT & BcryptJS** - Encrypted credential hashing and state-secured tokens

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Step 1: Clone the Project & Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env.local` file in the root directory and populate it with your local credentials:

```env
# Frontend Config
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:5173

# Supabase Auth & DB
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=your-supabase-connection-string

# Express Server Config
JWT_SECRET=your-super-secure-key-at-least-32-characters-long
NODE_ENV=development

# Stripe API Integration (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 3: Run the Project
To run the frontend and backend servers concurrently:

```bash
npm run dev:all
```

Alternatively, run them separately:
* **Frontend only:** `npm run dev`
* **Backend only:** `npm run dev:server`

---

## 📁 Project Structure

```
├── public/                 # Static assets (images, logos, icons)
├── server/                 # Express backend source code
│   ├── index.ts            # Entrypoint, DB sync, and Express server
│   └── ...                 # DB Schema, Auth, Stripe, & Cart routing
├── src/                    # React frontend application
│   ├── admin/              # Admin panel pages & components
│   ├── api/                # API client endpoints
│   ├── website/            # Core storefront components & pages
│   │   ├── components/     # Modals, Custom Studio, Drawers, etc.
│   │   ├── WebsiteApp.tsx  # Interactive storefront entrypoint
│   │   ├── data.ts         # Product collections & constants
│   │   └── types.ts        # TypeScript declarations
│   ├── App.tsx             # Root React Router mapping
│   ├── Roots.tsx           # Route guards & paths
│   └── main.tsx            # DOM initialization
├── index.html              # HTML markup template
├── package.json            # Scripts & project dependencies
└── tsconfig.json           # Compiler rules
```

---

## 🔌 API Reference

The backend API server runs by default on `http://localhost:3001/api`.

### Authentication
- `POST /auth/register` - Create a new user profile.
- `POST /auth/login` - Authenticate user credentials and return a token.
- `GET /auth/me` - Fetch verified profile details.

### Products
- `GET /products` - Fetch list of all active streetwear inventory.
- `GET /products/:id` - Fetch specifications for a single item.

### Shopping Cart
- `GET /cart` - Retrieve items in user's active cart.
- `POST /cart/add` - Add items or customs to cart.
- `PUT /cart/:itemId` - Update item counts.
- `DELETE /cart/:itemId` - Drop items from the cart.

### Orders & Checkout
- `POST /orders/checkout` - Create a checkout/Stripe session.
- `GET /orders` - Fetch chronological receipt history.

### Wishlist
- `GET /wishlist` - View saved user items.
- `POST /wishlist/add` - Add item to user wishlist.
- `DELETE /wishlist/:productId` - Remove item from user wishlist.

---

## 📜 Database Schema

Astitiva uses Supabase PostgreSQL database under the hood:
- **users:** Secure registry for credential mapping and user details.
- **products:** Central registry of pricing, descriptions, and categories.
- **cart_items:** Tracks active item quantities and customization fields.
- **orders:** Standard transactional registry.
- **wishlist:** Secure log tracking user favorites.

---

## ⚡ Next Steps & Contributions

Feel free to fork the repository and open pull requests! For detailed guides, consult the following resources:
* **Backend Design Details:** Check out [BACKEND_SETUP.md](BACKEND_SETUP.md)
* **Detailed API Endpoints:** Check out [API_REFERENCE.md](API_REFERENCE.md)
