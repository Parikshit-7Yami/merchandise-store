import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import productRoutes from './routes/products.js';
import studentRoutes from './routes/students.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Source - https://stackoverflow.com/q/79875229
// Posted by Sudarsan Sarkar, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-23, License - CC BY-SA 4.0

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "https://merchandise-store-two.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

async function start() {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.log('No MONGODB_URI – API will run but DB operations will fail until you add it.');
  }
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
