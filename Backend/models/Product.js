import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, enum: ['boys', 'girls', 'teachers'] },
    subcategory: { type: String, required: true },
    fabric: { type: String, required: true },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    description: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model('Product', productSchema);
