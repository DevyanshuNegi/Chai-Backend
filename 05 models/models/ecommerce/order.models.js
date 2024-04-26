import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  // another schema for product and quantity
  productId: {
    type: mongoose.Schema.Type.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: {
      type: [orderItemSchema], // we want to define the array ... of product and quantity
      // another approach
      /*
    type: [{
      defining schema object
    }]
    */
    },
    address: {
      type: String,
    },
    status: {
      // if we want user to select from a field giving choices
      type: String,
      enum: ['PENDING', 'CANCELED', 'DELIVERED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.Schema.model('Order', orderSchema);
