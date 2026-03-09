import {
  createReview as repoCreate,
  findReviewsByProduct,
  findReviewByUserAndProduct,
  findReviewById,
  updateReview as repoUpdate,
  deleteReview as repoDelete,
  updateProductRatingAndReviews,
} from '../repositories/review.repository';
import { findProductById } from '../repositories/product.repository';
import { findUserById } from '../repositories/user.repository';
import { ApiError } from '../exceptions/api.error';
import mongoose from 'mongoose';

export const addReview = async (
  userId: string,
  productId: string,
  rating: number,
  comment: string
) => {
  const product = await findProductById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError('Rating must be between 1 and 5', 400);
  }

  if (!comment || comment.trim().length === 0) {
    throw new ApiError('Comment is required', 400);
  }

  if (comment.trim().length > 1000) {
    throw new ApiError('Comment must be 1000 characters or less', 400);
  }

  const existingReview = await findReviewByUserAndProduct(userId, productId);
  if (existingReview) {
    throw new ApiError('You have already reviewed this product', 400);
  }

  const review = await repoCreate({
    product: new mongoose.Types.ObjectId(productId),
    user: new mongoose.Types.ObjectId(userId),
    userName: user.name,
    rating,
    comment: comment.trim(),
  });

  await updateProductRatingAndReviews(productId);

  return review;
};

export const getProductReviews = async (productId: string) => {
  const product = await findProductById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  return findReviewsByProduct(productId);
};

export const editReview = async (
  reviewId: string,
  userId: string,
  rating: number,
  comment: string
) => {
  const review = await findReviewById(reviewId);
  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  if (review.user.toString() !== userId) {
    throw new ApiError('You can only edit your own reviews', 403);
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError('Rating must be between 1 and 5', 400);
  }

  if (!comment || comment.trim().length === 0) {
    throw new ApiError('Comment is required', 400);
  }

  const updated = await repoUpdate(reviewId, {
    rating,
    comment: comment.trim(),
  });

  await updateProductRatingAndReviews(review.product.toString());

  return updated;
};

export const removeReview = async (reviewId: string, userId: string, userRole: string) => {
  const review = await findReviewById(reviewId);
  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Allow the review owner or admin to delete
  if (review.user.toString() !== userId && userRole !== 'admin') {
    throw new ApiError('You can only delete your own reviews', 403);
  }

  const productId = review.product.toString();
  await repoDelete(reviewId);
  await updateProductRatingAndReviews(productId);

  return { message: 'Review deleted successfully' };
};
