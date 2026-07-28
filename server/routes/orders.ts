import { Router, Response } from 'express';
import crypto from 'crypto';
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

// Create Razorpay Order
router.post('/razorpay/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { cart, shippingAddress, promoCode } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Server-side price calculation
    const subtotal = cart.reduce((sum: number, item: any) => sum + item.products.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
    
    // Load dynamic shipping config
    const shippingConfig = await getShippingConfig();
    const activeCoupon = (shippingConfig.couponCode || 'ASTITIVA10').toUpperCase();
    const activePopup = (shippingConfig.popupDiscountCode || 'VAULT10').toUpperCase();
    
    let discountPercent = 0;
    if (promoCode) {
      const promoUpper = promoCode.toUpperCase();
      if (promoUpper === 'GLACIER') {
        discountPercent = 0.15;
      } else if (promoUpper === activeCoupon || promoUpper === activePopup) {
        discountPercent = 0.10;
      }
    }
    const discount = subtotal * discountPercent;
    const shipping = (subtotal - discount) >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.baseShippingFee;
    const total = subtotal + tax - discount + shipping;

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: 'Razorpay keys not configured on server' });
    }

    const amountInPaise = Math.round(total * 100);

    const rzResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`
      })
    });

    if (!rzResponse.ok) {
      const errText = await rzResponse.text();
      console.error('Razorpay Error Response:', errText);
      return res.status(500).json({ error: `Razorpay Order creation failed: ${errText}` });
    }

    const rzOrder: any = await rzResponse.json();

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

    // Save Razorpay order ID in local order
    await supabase
      .from('orders')
      .update({ stripe_payment_intent_id: rzOrder.id })
      .eq('id', order.id);

    res.json({
      orderId: order.id,
      razorpayOrderId: rzOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ error: 'Failed to initialize Razorpay checkout' });
  }
});

// Verify Razorpay Payment Signature
router.post('/razorpay/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ error: 'Missing required validation attributes' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.error('Signature Mismatch!');
      return res.status(400).json({ error: 'Payment signature validation failed' });
    }

    // Payment is valid! Update status to paid/processing
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        stripe_payment_intent_id: razorpayPaymentId
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    res.json({ success: true });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment signature' });
  }
});

export default router;
