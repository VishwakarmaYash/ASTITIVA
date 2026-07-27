import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  createUser,
  getUserByEmail,
  verifyPassword,
  getAllUsers,
  deleteUser,
  updateUserPassword,
} from '../models/user';
import { generateToken, AuthRequest, authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { supabase } from '../config/database';
import { Resend } from 'resend';

const router = Router();

// Register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Split full name into first and last name (if provided)
    let firstName = '';
    let lastName = '';
    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const user = await createUser(email, password, firstName, lastName, phone);
    const token = generateToken(user.id, user.email, user.role || 'user');

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
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

    const token = generateToken(user.id, user.email, user.role || 'user');

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get all customers (admin only)
router.get('/customers', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Delete a customer (admin only)
router.delete('/users/:userId', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Request password reset token
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Verify user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No user registered with this email address' });
    }

    // Generate 6-digit numeric token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString(); // 15 mins expiry

    // Delete any old tokens
    await supabase
      .from('password_resets')
      .delete()
      .eq('email', email);

    // Insert new token
    const { error: insertError } = await supabase
      .from('password_resets')
      .insert([
        {
          email,
          token,
          expires_at: expiresAt,
        },
      ]);

    if (insertError) throw insertError;

    // Send email using Resend if API key is provided, otherwise fallback to console log
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Astitiva Security <onboarding@resend.dev>',
          to: email,
          subject: '🔑 Astitiva Access Decryption Code',
          html: `
            <div style="font-family: monospace; padding: 20px; background-color: #f9f9fb; border: 1px solid #eee; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #141b2b; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #141b2b; padding-bottom: 10px;">Astitiva Security Protocol</h2>
              <p style="font-size: 13px; color: #1a1c1d; line-height: 1.6;">A password recovery request has been initiated for your Astitiva credentials.</p>
              <p style="font-size: 11px; text-transform: uppercase; color: #575f65; margin-top: 20px;">AUTHORIZED DECRYPTION CODE:</p>
              <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 15px 0; color: #141b2b; background-color: #eeeef0; padding: 15px; text-align: center; border: 1px dashed #cfd1d4;">
                ${token}
              </div>
              <p style="color: #81898e; font-size: 10px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">This security token expires in 15 minutes. If you did not request this code, please ignore this message.</p>
            </div>
          `
        });
        console.log(`[Resend] Security decryption token successfully delivered to ${email}`);
        res.json({ success: true, message: 'Reset code successfully delivered via Resend' });
      } catch (emailError: any) {
        console.error('[Resend] Failed to send email, falling back to console:', emailError.message);
        
        // Fallback to console log
        console.log('\n========================================');
        console.log(`🔑 SECURITY PROTOCOL: PASSWORD RESET CODE (FALLBACK)`);
        console.log(`Email: ${email}`);
        console.log(`Reset Code: ${token}`);
        console.log('========================================\n');
        
        res.json({ success: true, message: 'Reset code sent (logged to console fallback)' });
      }
    } else {
      // Simulate sending email: output to server console log
      console.log('\n========================================');
      console.log(`🔑 SECURITY PROTOCOL: PASSWORD RESET CODE`);
      console.log(`Email: ${email}`);
      console.log(`Reset Code: ${token}`);
      console.log('========================================\n');

      res.json({ success: true, message: 'Reset code sent (logged to console)' });
    }
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process forgot password request' });
  }
});

// Reset password using token
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ error: 'Email, reset code, and new password are required' });
    }

    // Find valid non-expired token
    const { data: resetEntry, error: queryError } = await supabase
      .from('password_resets')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (queryError || !resetEntry) {
      return res.status(400).json({ error: 'Invalid or expired password reset code' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password_hash
    await updateUserPassword(email, hashedPassword);

    // Clean up reset token
    await supabase
      .from('password_resets')
      .delete()
      .eq('email', email);

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
