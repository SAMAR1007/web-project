import { Router } from 'express';
import {
  createConversation,
  getConversation,
  listUserConversations,
  listAdminConversations,
  addMessage,
  closeChat,
  markRead,
  unreadCount,
} from '../controller/chat.controller';
import { verifyToken, isAuthenticated, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// User endpoints
router.post('/', verifyToken, isAuthenticated, createConversation);
router.get('/', verifyToken, isAuthenticated, listUserConversations);
router.get('/unread', verifyToken, isAuthenticated, unreadCount);
router.get('/:id', verifyToken, isAuthenticated, getConversation);
router.post('/:id/messages', verifyToken, isAuthenticated, addMessage);
router.patch('/:id/read', verifyToken, isAuthenticated, markRead);

// Admin endpoints
router.get('/admin/all', verifyToken, isAdmin, listAdminConversations);
router.patch('/:id/close', verifyToken, isAdmin, closeChat);

export default router;
