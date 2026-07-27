import { Router, Response } from 'express';
import { getShippingConfig, updateShippingConfig } from '../models/shipping';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

// Get active shipping/marketing configuration (public)
router.get('/', async (req, res: Response) => {
  try {
    const config = await getShippingConfig();
    res.json(config);
  } catch (error) {
    console.error('Get shipping config error:', error);
    res.status(500).json({ error: 'Failed to fetch shipping configuration' });
  }
});

// Update configuration (admin only)
router.put('/', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updatedConfig = await updateShippingConfig(req.body);
    res.json(updatedConfig);
  } catch (error) {
    console.error('Update shipping config error:', error);
    res.status(500).json({ error: 'Failed to update shipping configuration' });
  }
});

export default router;
