import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './Backend/models/Product.js';

dotenv.config({ path: './Backend/.env' });

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  console.log(`Found ${products.length} products`);
  for (const p of products) {
    if (typeof p.stock === 'number') {
      const stockObj = {};
      const qty = Math.floor(p.stock / (p.sizes?.length || 1));
      p.sizes.forEach(s => stockObj[s] = qty);
      
      // Update directly in mongo to avoid cast errors if we change schema first
      await mongoose.connection.db.collection('products').updateOne(
        { _id: p._id },
        { $set: { stock: stockObj } }
      );
      console.log(`Migrated ${p.name} stock to ${JSON.stringify(stockObj)}`);
    }
  }
  console.log('Done');
  process.exit(0);
}

migrate();
