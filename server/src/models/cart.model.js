import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { toJsonPlugin } from '../plugins/toJson.plugin.js';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

cartSchema.virtual('itemCount').get(function itemCount() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.plugin(mongooseLeanVirtuals);
cartSchema.plugin(toJsonPlugin);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
