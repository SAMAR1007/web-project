import { ReviewModel } from '../models/review.model';
import { ProductModel } from '../models/product.model';
import { IReview } from '../types/review.type';
import mongoose from 'mongoose';

export const createReview = (data: Partial<IReview>) => {
  return ReviewModel.create(data);
};

export const findReviewsByProduct = (productId: string) => {
  return ReviewModel.find({ product: productId }).sort({ createdAt: -1 });
};

export const findReviewByUserAndProduct = (userId: string, productId: string) => {
  return ReviewModel.findOne({ user: userId, product: productId });
};

export const findReviewById = (id: string) => {
  return ReviewModel.findById(id);
};

export const updateReview = (id: string, data: Partial<IReview>) => {
  return ReviewModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReview = (id: string) => {
  return ReviewModel.findByIdAndDelete(id);
};

export const getProductReviewStats = async (productId: string) => {
  const result = await ReviewModel.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
  };
};

export const updateProductRatingAndReviews = async (productId: string) => {
  const stats = await getProductReviewStats(productId);
  await ProductModel.findByIdAndUpdate(productId, {
    rating: stats.averageRating,
    reviews: stats.totalReviews,
  });
  return stats;
};
