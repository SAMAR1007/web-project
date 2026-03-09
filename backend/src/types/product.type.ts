import { Document } from 'mongoose';

export const PRODUCT_CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Audio',
  'Wearables',
  'Cameras',
  'Gaming',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface IProduct extends Document {
  name: string;
  price: number;
  category: ProductCategory;
  brand?: string;
  description?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  isDeal?: boolean;
  dealType?: 'flash' | 'weekly' | 'clearance';
  discountPercent?: number;
  createdAt: Date;
  updatedAt: Date;
}
