import {
  createConversation as repoCreateConversation,
  findConversationById,
  findConversationsByUserId,
  findAllConversations,
  addMessageToConversation as repoAddMessage,
  updateConversationStatus as repoUpdateStatus,
  markMessagesAsRead as repoMarkRead,
  countUnreadForUser as repoCountUnreadUser,
  countUnreadForAdmin as repoCountUnreadAdmin,
} from '../repositories/conversation.repository';
import { findProductById } from '../repositories/product.repository';
import { ApiError } from '../exceptions/api.error';

export const startConversation = async (
  userId: string,
  subject: string,
  message: string,
  productId?: string
) => {
  if (!subject || !message) {
    throw new ApiError('Subject and message are required', 400);
  }

  // Validate product if provided
  if (productId) {
    const product = await findProductById(productId);
    if (!product) {
      throw new ApiError('Product not found', 404);
    }
  }

  const conversation = await repoCreateConversation({
    user: userId as any,
    product: productId ? (productId as any) : undefined,
    subject,
    messages: [
      {
        sender: userId as any,
        senderRole: 'user',
        content: message,
        createdAt: new Date(),
      },
    ],
    lastMessage: message,
    lastMessageAt: new Date(),
  });

  return findConversationById((conversation._id as any).toString());
};

export const getConversationById = async (conversationId: string, userId: string, userRole: string) => {
  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  // Users can only access their own conversations, admins can access any
  if (userRole !== 'admin' && conversation.user._id.toString() !== userId) {
    throw new ApiError('Unauthorized access to conversation', 403);
  }

  return conversation;
};

export const getUserConversations = async (userId: string) => {
  return findConversationsByUserId(userId);
};

export const getAdminConversations = async () => {
  return findAllConversations();
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderRole: 'user' | 'admin',
  content: string
) => {
  if (!content || !content.trim()) {
    throw new ApiError('Message content is required', 400);
  }

  const conversation = await findConversationById(conversationId);
  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  if (conversation.status === 'closed') {
    throw new ApiError('Cannot send messages to a closed conversation', 400);
  }

  // Users can only send to their own conversations
  if (senderRole === 'user' && conversation.user._id.toString() !== senderId) {
    throw new ApiError('Unauthorized', 403);
  }

  return repoAddMessage(conversationId, {
    sender: senderId,
    senderRole,
    content: content.trim(),
  });
};

export const closeConversation = async (conversationId: string) => {
  const conversation = await findConversationById(conversationId);
  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  return repoUpdateStatus(conversationId, 'closed');
};

export const markAsRead = async (conversationId: string, readerRole: 'user' | 'admin') => {
  return repoMarkRead(conversationId, readerRole);
};

export const getUnreadCount = async (userId: string, role: string) => {
  if (role === 'admin') {
    return repoCountUnreadAdmin();
  }
  return repoCountUnreadUser(userId);
};
