import { Response } from 'express';
import {
  createProduct as createProductService,
  getAdminProducts,
  getProductsForUser,
  getProductById,
  updateProduct as updateProductService,
  removeProduct,
  getDealProducts,
} from '../services/product.service';

export const createProduct = async (req: any, res: Response) => {
  try {
    const body = req.body;
    const payload: any = {
      name: body.name,
      price: body.price ? parseFloat(body.price) : undefined,
      category: body.category,
      brand: body.brand || '',
      description: body.description || '',
      rating: body.rating ? parseFloat(body.rating) : 0,
      reviews: body.reviews ? parseInt(body.reviews, 10) : 0,
      isDeal: body.isDeal === 'true' || body.isDeal === true,
      dealType: body.dealType || null,
      discountPercent: body.discountPercent ? parseInt(body.discountPercent, 10) : 0,
    };
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }
    const product = await createProductService(payload);
    res.status(201).json({
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to create product',
    });
  }
};

export const listAdminProducts = async (req: any, res: Response) => {
  try {
    const products = await getAdminProducts();
    res.status(200).json({
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch products',
    });
  }
};

export const listPublicProducts = async (req: any, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const brand = req.query.brand as string | undefined;
    const products = await getProductsForUser(category, brand);
    res.status(200).json({
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch products',
    });
  }
};

export const getProduct = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await getProductById(id);
    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch product',
    });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;
    const payload: any = {
      name: body.name,
      price: body.price != null ? parseFloat(body.price) : undefined,
      category: body.category,
      brand: body.brand !== undefined ? body.brand : undefined,
      description: body.description,
      rating: body.rating != null ? parseFloat(body.rating) : undefined,
      reviews: body.reviews != null ? parseInt(body.reviews, 10) : undefined,
      isDeal: body.isDeal !== undefined ? (body.isDeal === 'true' || body.isDeal === true) : undefined,
      dealType: body.dealType !== undefined ? (body.dealType || null) : undefined,
      discountPercent: body.discountPercent !== undefined ? parseInt(body.discountPercent, 10) : undefined,
    };
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }
    const product = await updateProductService(id, payload);
    res.status(200).json({
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to update product',
    });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    await removeProduct(id);
    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to delete product',
    });
  }
};

export const listDealProducts = async (req: any, res: Response) => {
  try {
    const products = await getDealProducts();
    res.status(200).json({
      message: 'Deal products retrieved successfully',
      data: products,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch deal products',
    });
  }
};
