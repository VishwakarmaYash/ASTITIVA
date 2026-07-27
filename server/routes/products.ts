import { Router, Response } from 'express';
import { getAllProducts, getProductById, createProduct, updateProductInventory } from '../models/product';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { supabase } from '../config/database';

const router = Router();

// Get all products (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only - requires auth)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, price, compareAtPrice, description, category, image, colorCode, features, specs, sizes, images } = req.body;

    if (!id || !name || !price) {
      return res.status(400).json({ error: 'ID, name, and price are required' });
    }

    const product = {
      id,
      name,
      price,
      compare_at_price: compareAtPrice || null,
      description: description || '',
      category: category || 'Accessories',
      image: image || '',
      color_code: colorCode || '',
      features: features || [],
      specs: specs || [],
      sizes: sizes || [],
      inventory: 100,
      images: images || [],
    };

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, compareAtPrice, description, category, image, colorCode, features, specs, sizes, images } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        price,
        compare_at_price: compareAtPrice || null,
        description,
        category,
        image,
        color_code: colorCode,
        features,
        specs,
        sizes,
        images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ deleted: true, id });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
