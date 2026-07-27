import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import wishlistRoutes from './routes/wishlist';
import bannerRoutes from './routes/banners';
import shippingRoutes from './routes/shipping';
// import adminMiddleware from './middleware/admin'; // admin middleware (unused for now)

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate required environment variables (no fallbacks)
const requiredEnv = ['JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('Missing required env vars:', missingEnv.join(', '));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins to support Vercel preview domains, local tunnels, and custom domains
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/shipping', shippingRoutes);
// Example admin-protected route (uncomment and add routes as needed)
// app.use('/api/admin', adminMiddleware, adminRoutes);

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'Server is running' })
);

// 404 handler for API routes
app.use('/api', (req, res) =>
  res.status(404).json({ error: 'API endpoint not found' })
);

// Catch-all for non-API routes
app.use((req, res) =>
  res.status(404).json({ error: 'Not found' })
);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API ready at http://localhost:${PORT}/api`);
});
