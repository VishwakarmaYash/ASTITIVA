import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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
      req.userId = decoded.id;
      req.email = decoded.email;
      req.role = decoded.role; // optional role claim
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
