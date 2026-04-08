import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { sendOrderConfirmation } from '../mailer.js';

const router = Router();

// Lazily initialize Razorpay to avoid crash if env vars are not yet set
let razorpay = null;
function getRazorpay() {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env');
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

// Create a Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err.message || err);
    res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
});

// Verify payment and create order
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    // Verify the payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Invalid signature.' });
    }

    // Signature valid — create order in DB
    const { items, customItems, userDetails, totalPrice, paymentMethod } = orderData;

    if (!userDetails || !userDetails.name || !userDetails.email || !userDetails.rollNumber || !userDetails.department || !userDetails.mobile) {
      return res.status(400).json({ error: 'Missing required user details' });
    }

    const orderId = `ORD-${Date.now()}`;
    const now = new Date();

    const order = await Order.create({
      orderId,
      items: items || [],
      customItems: customItems || [],
      userDetails,
      totalPrice: Number(totalPrice),
      status: 'confirmed',
      statusHistory: [{ status: 'confirmed', timestamp: now }],
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: 'paid',
    });

    const orderObj = order.toJSON();

    // Send confirmation email (don't block response on failure)
    try {
      await sendOrderConfirmation(orderObj);
    } catch (emailErr) {
      console.error('Failed to send order confirmation email:', emailErr.message);
    }

    res.status(201).json(orderObj);
  } catch (err) {
    console.error('Payment verification failed:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
