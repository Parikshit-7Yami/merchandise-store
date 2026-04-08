import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, required: true, default: 1 },
}, { _id: false });

const customItemSchema = new mongoose.Schema({
  clubName: { type: String },
  collegeName: { type: String },
  productType: { type: String },
  fabricType: { type: String },
  color: { type: String },
  gender: { type: String },
  size: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  nameOnBack: { type: String },
  numberOnBack: { type: String },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    customItems: [customItemSchema],
    userDetails: {
      name: { type: String, required: true },
      rollNumber: { type: String, required: true },
      department: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
    },
    totalPrice: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentMethod: { type: String, default: 'online' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'],
      default: 'confirmed',
    },
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Order = mongoose.model('Order', orderSchema);
