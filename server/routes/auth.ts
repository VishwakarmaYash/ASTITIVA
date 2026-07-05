import { Router, Response } from 'express';
import { createUser, getUserByEmail, verifyPassword } from '../models/user';
import { generateToken, AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await createUser(email, password);
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error.message, error.code);
    
    // Check if it's a database table not found error
    if (error.message?.includes('Could not find the table') || error.code?.includes('PGRST')) {
      return res.status(503).json({ 
        error: 'Database not initialized. Please run the SQL setup in Supabase.',
        details: 'See BACKEND_SETUP.md for setup instructions'
      });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("================================");
    console.log("Login attempt");
    console.log("Email entered:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await getUserByEmail(email);

    console.log("User from DB:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValid = await verifyPassword(password, user.password_hash);

    console.log("Password valid:", isValid);

    if (!isValid) {
      console.log("❌ Wrong password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ Login successful");

    const token = generateToken(user.id, user.email);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
