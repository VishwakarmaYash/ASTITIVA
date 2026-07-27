import { Router, Response } from 'express';
// import Stripe from 'stripe'; // Stripe integration removed
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from '../models/order';
import { supabase } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { getShippingConfig } from '../models/shipping';

const router = Router();

// Create order from cart (no Stripe integration)
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { cart, shippingAddress } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Server-side price calculation
    const subtotal = cart.reduce((sum: number, item: any) => sum + item.products.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
    
    // Load dynamic shipping config
    const shippingConfig = await getShippingConfig();
    const shipping = subtotal >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.baseShippingFee;
    
    const total = subtotal + tax + shipping;

    const orderItems = cart.map((item: any) => ({
      productId: item.product_id,
      productName: item.products.name,
      size: item.size,
      quantity: item.quantity,
      price: item.products.price,
      customization: item.customization || null,
    }));

    const order = await createOrder(
      req.userId!,
      orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress || ''
    );

    // Return order confirmation
    res.json({ orderId: order.id, total, tax, shipping, subtotal });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders (or all orders if admin)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.role === 'admin') {
      const orders = await getAllOrders();
      return res.json(orders);
    }
    const orders = await getUserOrders(req.userId!);
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:orderId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (order.user_id !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.put('/:orderId/status', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedOrder = await updateOrderStatus(orderId, status);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Delete an order (admin only)
router.delete('/:orderId', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
