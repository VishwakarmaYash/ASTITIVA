import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Enforce presence of JWT secret; no fallback allowed
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is missing');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

    if (typeof decoded === 'object' && 'id' in decoded) {
      // Verify user still exists in database to prevent foreign key errors for deleted users
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', decoded.id)
        .single();

      if (dbError || !dbUser) {
        return res.status(401).json({ error: 'User account has been deactivated or deleted' });
      }

      req.userId = decoded.id;
      req.email = decoded.email;
      req.role = dbUser.role || decoded.role;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed' });
  }
};

export const generateToken = (userId: string, email: string, role: string = 'user') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};
