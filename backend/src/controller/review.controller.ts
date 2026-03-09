import { Response } from 'express';
import {
  addReview,
  getProductReviews,
  editReview,
  removeReview,
} from '../services/review.service';

export const createReview = async (req: any, res: Response) => {
  try {
    const productId = req.params.productId;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await addReview(userId, productId, rating, comment);
    res.status(201).json({
      message: 'Review added successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to add review',
    });
  }
};

export const listProductReviews = async (req: any, res: Response) => {
  try {
    const productId = req.params.productId;
    const reviews = await getProductReviews(productId);
    res.status(200).json({
      message: 'Reviews retrieved successfully',
      data: reviews,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch reviews',
    });
  }
};

export const updateReview = async (req: any, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await editReview(reviewId, userId, rating, comment);
    res.status(200).json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to update review',
    });
  }
};

export const deleteReview = async (req: any, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await removeReview(reviewId, userId, userRole);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to delete review',
    });
  }
};
