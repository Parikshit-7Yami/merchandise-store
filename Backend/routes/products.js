import { Router } from 'express';
import { Product } from '../models/Product.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { notifyStudentsOfNewProduct } from '../mailer.js';
import multer from 'multer';
import cloudinary from '../cloudinary.js';

// Use memory storage — file buffer is uploaded directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = Router();

router.post('/upload', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'campus-threads',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    const list = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, price, image, category, subcategory, fabric, colors, sizes, description, stock } = req.body;
    if (!name || price == null || !image || !category || !subcategory || !fabric) {
      return res.status(400).json({
        error: 'Missing required fields: name, price, image, category, subcategory, fabric',
      });
    }
    const product = await Product.create({
      name,
      price: Number(price),
      image,
      category,
      subcategory,
      fabric,
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      description: description || '',
      stock: stock ? Number(stock) : 0,
    });
    const productObj = product.toJSON();
    productObj.id = product._id.toString();

    const notify = await notifyStudentsOfNewProduct(productObj);
    res.status(201).json({
      product: productObj,
      notification: { sent: notify.sent, failed: notify.failed },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    const updateFields = {};
    if (price !== undefined && !isNaN(Number(price))) {
      updateFields.price = Number(price);
    }
    if (stock !== undefined && !isNaN(Number(stock))) {
      updateFields.stock = Number(stock);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'Valid price or stock is required' });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productObj = product.toJSON();
    productObj.id = product._id.toString();
    res.json(productObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
