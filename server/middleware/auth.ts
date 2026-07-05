import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    if (typeof decoded === 'object' && 'id' in decoded) {
      req.userId = decoded.id;
      req.email = decoded.email;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed' });
  }
};

export const generateToken = (userId: string, email: string) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' }
  );
};
