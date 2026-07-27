import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Assuming auth middleware has populated req.userId and req.role
  // If role is not present, treat as non-admin
  const userRole = (req as any).role;
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
export default requireAdmin;
