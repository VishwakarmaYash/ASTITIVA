import { Router, Response } from 'express';
import { supabase } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get cart
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
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
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ error: 'Product ID and size required' });
    }

    // Check if item already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.userId)
      .eq('product_id', productId)
      .eq('size', size)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity: existing.quantity + (quantity || 1),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select(
          `
          *,
          products (*)
        `
        )
        .single();

      if (error) throw error;
      return res.json(data);
    }

    // Create new cart item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: req.userId,
          product_id: productId,
          size,
          quantity: quantity || 1,
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
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Update cart item quantity
router.put('/:itemId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      // Delete if quantity is 0 or less
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', req.userId);

      if (error) throw error;
      return res.json({ deleted: true });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('user_id', req.userId)
      .select(
        `
        *,
        products (*)
      `
      )
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove from cart
router.delete('/:itemId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ deleted: true });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ cleared: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
