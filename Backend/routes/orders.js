import { Router } from 'express';
import { Order } from '../models/Order.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '../mailer.js';

const router = Router();

// Place a new order (student)
router.post('/', async (req, res) => {
  try {
    const { items, customItems, userDetails, totalPrice } = req.body;

    if (!userDetails || !userDetails.name || !userDetails.email || !userDetails.rollNumber || !userDetails.department || !userDetails.mobile) {
      return res.status(400).json({ error: 'Missing required user details (name, email, rollNumber, department, mobile)' });
    }
    if (totalPrice == null) {
      return res.status(400).json({ error: 'totalPrice is required' });
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
    console.error('Order creation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get orders by email (student)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'email query parameter is required' });
    }
    const orders = await Order.find({ 'userDetails.email': email.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();

    const list = orders.map((o) => ({
      ...o,
      id: o._id.toString(),
      _id: undefined,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    const list = orders.map((o) => ({
      ...o,
      id: o._id.toString(),
      _id: undefined,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ ...order, id: order._id.toString(), _id: undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin)
router.put('/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        $set: { status },
        $push: { statusHistory: { status, timestamp: new Date() } },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderObj = order.toJSON();

    // Send status update email (don't block response on failure)
    try {
      await sendOrderStatusUpdate(orderObj, status);
    } catch (emailErr) {
      console.error('Failed to send order status email:', emailErr.message);
    }

    res.json(orderObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
