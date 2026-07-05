import { Router, Response } from 'express';
import { supabase } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get wishlist
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(
        `
        *,
        products (*)
      `
      )
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/add', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', req.userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert([
        {
          user_id: req.userId,
          product_id: productId,
        },
      ])
      .select(
        `
        *,
        products (*)
      `
      )
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:productId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', req.userId)
      .eq('product_id', productId);

    if (error) throw error;
    res.json({ deleted: true });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
