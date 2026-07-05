import { Router, Response } from 'express';
import Stripe from 'stripe';
import { createOrder, getUserOrders, getOrderById } from '../models/order';
import { supabase } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create checkout session
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { cart, shippingAddress } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cart.reduce((sum: number, item: any) => sum + item.products.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/cart`,
      customer_email: req.email,
      line_items: cart.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.products.name} - Size ${item.size}`,
            description: item.products.description,
            images: [item.products.image],
          },
          unit_amount: Math.round(item.products.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      })),
      metadata: {
        userId: req.userId,
      },
    });

    // Create pending order
    const orderItems = cart.map((item: any) => ({
      productId: item.product_id,
      productName: item.products.name,
      size: item.size,
      quantity: item.quantity,
      price: item.products.price,
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

    res.json({
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get user orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
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
    if (order.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Stripe webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update order status
      // Implementation depends on how you link session to order
      console.log('Payment successful:', session.id);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook failed' });
  }
});

export default router;
