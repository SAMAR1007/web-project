import { ProductModel } from '../models/product.model';
import { IProduct, ProductCategory } from '../types/product.type';

export const createProduct = (data: Partial<IProduct>) => {
  return ProductModel.create(data);
};

export const findAllProducts = () => {
  return ProductModel.find().sort({ category: 1, createdAt: -1 });
};

export const findProductsByCategory = (category: ProductCategory) => {
  return ProductModel.find({ category }).sort({ createdAt: -1 });
};

export const findProductById = (id: string) => {
  return ProductModel.findById(id);
};

export const updateProduct = (id: string, data: Partial<IProduct>) => {
  return ProductModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = (id: string) => {
  return ProductModel.findByIdAndDelete(id);
};

export const getAllProductsWithCategoryFilter = async (category?: string, brand?: string) => {
  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  return ProductModel.find(filter).sort({ category: 1, brand: 1, createdAt: -1 });
};

export const findDealProducts = () => {
  return ProductModel.find({ isDeal: true }).sort({ createdAt: -1 });
};
