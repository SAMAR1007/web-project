import { Schema, model } from 'mongoose';
import { IProduct, PRODUCT_CATEGORIES } from '../types/product.type';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
    },
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeal: {
      type: Boolean,
      default: false,
    },
    dealType: {
      type: String,
      enum: ['flash', 'weekly', 'clearance'],
      default: null,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>('Product', productSchema);
