import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { toJsonPlugin } from '../plugins/toJson.plugin.js';
import { auditPlugin } from '../plugins/audit.plugin.js';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    category: {
      type: String,
      required: true,
      enum: ['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories']
    },
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 100000
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
      default: 0
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.virtual('isLowStock').get(function isLowStock() {
  return this.stock <= 5;
});

productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseLeanVirtuals);
productSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
productSchema.plugin(auditPlugin);
productSchema.plugin(toJsonPlugin);

const Product = mongoose.model('Product', productSchema);
export default Product;
