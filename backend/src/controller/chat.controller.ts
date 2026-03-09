import { Request, Response } from 'express';
import {
  startConversation,
  getConversationById,
  getUserConversations,
  getAdminConversations,
  sendMessage,
  closeConversation,
  markAsRead,
  getUnreadCount,
} from '../services/chat.service';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { subject, message, productId } = req.body as {
      subject: string;
      message: string;
      productId?: string;
    };

    const conversation = await startConversation(userId, subject, message, productId);

    res.status(201).json({
      message: 'Conversation started successfully',
      data: conversation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to start conversation',
    });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const userRole = req.user?.role as string;

    const conversation = await getConversationById(id as string, userId, userRole);

    res.status(200).json({
      message: 'Conversation retrieved successfully',
      data: conversation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch conversation',
    });
  }
};

export const listUserConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const conversations = await getUserConversations(userId);

    res.status(200).json({
      message: 'Conversations retrieved successfully',
      data: conversations,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch conversations',
    });
  }
};

export const listAdminConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await getAdminConversations();

    res.status(200).json({
      message: 'Conversations retrieved successfully',
      data: conversations,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch conversations',
    });
  }
};

export const addMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const userRole = req.user?.role as string;
    const { content } = req.body as { content: string };

    const conversation = await sendMessage(id as string, userId, userRole as 'user' | 'admin', content);

    res.status(200).json({
      message: 'Message sent successfully',
      data: conversation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to send message',
    });
  }
};

export const closeChat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await closeConversation(id as string);

    res.status(200).json({
      message: 'Conversation closed successfully',
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to close conversation',
    });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role as string;

    await markAsRead(id as string, userRole as 'user' | 'admin');

    res.status(200).json({
      message: 'Messages marked as read',
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to mark messages as read',
    });
  }
};

export const unreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const userRole = req.user?.role as string;

    const count = await getUnreadCount(userId, userRole);

    res.status(200).json({
      message: 'Unread count retrieved',
      data: { count },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to get unread count',
    });
  }
};
