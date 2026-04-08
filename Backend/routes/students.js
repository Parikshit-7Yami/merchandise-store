import { Router } from 'express';
import { Student } from '../models/Student.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { notifyStudentsBroadcast } from '../mailer.js';

const router = Router();

// Get all students (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();
    const list = students.map((s) => ({
      id: s._id.toString(),
      email: s.email,
      name: s.name || '',
      createdAt: s.createdAt,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin add student (no password needed - admin creates account)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const student = await Student.create({
      email: email.trim().toLowerCase(),
      name: (name || '').trim(),
      password: password || 'campus123', // Default password for admin-created accounts
    });
    res.status(201).json({
      id: student._id.toString(),
      email: student.email,
      name: student.name || '',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This email is already added' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Student registration (public)
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const student = await Student.create({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password,
    });
    res.status(201).json({
      id: student._id.toString(),
      email: student.email,
      name: student.name,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Student login (public)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const student = await Student.findOne({ email: email.trim().toLowerCase() });
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({
      id: student._id.toString(),
      email: student.email,
      name: student.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribe (public - also creates account if needed)
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const student = await Student.create({
      email: email.trim().toLowerCase(),
      name: (name || '').trim(),
      password: password || 'campus123',
    });
    res.status(201).json({
      id: student._id.toString(),
      email: student.email,
      name: student.name || '',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This email is already added' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Broadcast notification (admin only)
router.post('/broadcast', adminAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }
    const result = await notifyStudentsBroadcast(subject, message);
    res.json({
      success: true,
      notification: { sent: result.sent, failed: result.failed },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
