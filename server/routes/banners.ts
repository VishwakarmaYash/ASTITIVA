import { Router, Response } from 'express';
import { getActiveBanners, getAllBanners, createBanner, updateBanner, deleteBanner } from '../models/banner';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

// Get active banners by location (public)
router.get('/', async (req, res: Response) => {
  try {
    const location = (req.query.location as string) || 'homepage';
    const banners = await getActiveBanners(location);
    res.json(banners);
  } catch (error) {
    console.error('Get active banners error:', error);
    res.status(500).json({ error: 'Failed to fetch active banners' });
  }
});

// Get all banners for admin panel (admin only)
router.get('/admin', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const banners = await getAllBanners();
    res.json(banners);
  } catch (error) {
    console.error('Get admin banners error:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Create banner (admin only)
router.post('/', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, imageUrl, buttonText, buttonLink, location, startDate, endDate, isActive, priority } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const banner = await createBanner({
      title: title || null,
      description: description || null,
      imageUrl,
      buttonText: buttonText || 'Shop Now',
      buttonLink: buttonLink || '/',
      location: location || 'homepage',
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive !== undefined ? isActive : true,
      priority: priority !== undefined ? Number(priority) : 0,
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// Update banner (admin only)
router.put('/:id', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, buttonText, buttonLink, location, startDate, endDate, isActive, priority } = req.body;

    const banner = await updateBanner(id, {
      title,
      description,
      imageUrl,
      buttonText,
      buttonLink,
      location,
      startDate,
      endDate,
      isActive,
      priority: priority !== undefined ? Number(priority) : undefined,
    });

    res.json(banner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Delete banner (admin only)
router.delete('/:id', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteBanner(id);
    res.json({ success: true, message: 'Banner removed successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default router;
