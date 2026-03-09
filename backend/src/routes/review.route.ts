import { Router } from 'express';
import {
  createReview,
  listProductReviews,
  updateReview,
  deleteReview,
} from '../controller/review.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Public: get reviews for a product
router.get('/:productId', listProductReviews);

// Authenticated: add a review
router.post('/:productId', verifyToken, createReview);

// Authenticated: update own review
router.put('/:reviewId', verifyToken, updateReview);

// Authenticated: delete own review (or admin)
router.delete('/:reviewId', verifyToken, deleteReview);

export default router;
