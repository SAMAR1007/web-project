import { Router } from 'express';
import { createOrder, initiateEsewaPayment, listAllOrders, listUserOrders, updateOrderStatus, verifyPayment } from '../controller/order.controller';
import { isAdmin, isAuthenticated, verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// User endpoints
router.post('/', verifyToken, isAuthenticated, createOrder);
router.get('/', verifyToken, isAuthenticated, listUserOrders);
router.post('/payment/initiate', verifyToken, isAuthenticated, initiateEsewaPayment);
router.post('/payment/verify', verifyToken, isAuthenticated, verifyPayment);

// Admin endpoint to view all orders
router.get('/all', verifyToken, isAdmin, listAllOrders);
router.patch('/:orderId/status', verifyToken, isAdmin, updateOrderStatus);

export default router;

