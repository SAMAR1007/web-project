import {
  createProduct as repoCreate,
  findAllProducts,
  findProductsByCategory,
  findProductById,
  updateProduct as repoUpdate,
  deleteProduct as repoDelete,
  getAllProductsWithCategoryFilter,
  findDealProducts,
} from '../repositories/product.repository';
import { ApiError } from '../exceptions/api.error';
import { IProduct, ProductCategory, PRODUCT_CATEGORIES } from '../types/product.type';

export const createProduct = async (data: Partial<IProduct>) => {
  if (!data.name || data.price == null || !data.category) {
    throw new ApiError('Name, price and category are required', 400);
  }
  if (!PRODUCT_CATEGORIES.includes(data.category as ProductCategory)) {
    throw new ApiError(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`, 400);
  }
  return repoCreate(data);
};

export const getAdminProducts = async () => {
  return findAllProducts();
};

export const getProductsForUser = async (category?: string, brand?: string) => {
  return getAllProductsWithCategoryFilter(category, brand);
};

export const getProductById = async (id: string) => {
  const product = await findProductById(id);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return product;
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const product = await findProductById(id);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  if (data.category && !PRODUCT_CATEGORIES.includes(data.category as ProductCategory)) {
    throw new ApiError(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`, 400);
  }
  return repoUpdate(id, data);
};

export const removeProduct = async (id: string) => {
  const product = await findProductById(id);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return repoDelete(id);
};

export const getDealProducts = async () => {
  return findDealProducts();
};
