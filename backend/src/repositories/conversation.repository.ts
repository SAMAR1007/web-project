import { ConversationModel } from '../models/conversation.model';
import { IConversation } from '../types/chat.type';

export const createConversation = (data: Partial<IConversation>) => {
  return ConversationModel.create(data);
};

export const findConversationById = (id: string) => {
  return ConversationModel.findById(id)
    .populate('user', 'name email image')
    .populate('product', 'name price image category')
    .populate('messages.sender', 'name image role');
};

export const findConversationsByUserId = (userId: string) => {
  return ConversationModel.find({ user: userId })
    .populate('product', 'name price image category')
    .sort({ lastMessageAt: -1 });
};

export const findAllConversations = () => {
  return ConversationModel.find()
    .populate('user', 'name email image')
    .populate('product', 'name price image category')
    .sort({ lastMessageAt: -1 });
};

export const addMessageToConversation = (
  conversationId: string,
  message: { sender: string; senderRole: 'user' | 'admin'; content: string }
) => {
  return ConversationModel.findByIdAndUpdate(
    conversationId,
    {
      $push: { messages: message },
      $set: {
        lastMessage: message.content,
        lastMessageAt: new Date(),
      },
    },
    { new: true }
  )
    .populate('user', 'name email image')
    .populate('product', 'name price image category')
    .populate('messages.sender', 'name image role');
};

export const updateConversationStatus = (conversationId: string, status: 'active' | 'closed') => {
  return ConversationModel.findByIdAndUpdate(conversationId, { status }, { new: true });
};

export const markMessagesAsRead = (conversationId: string, readerRole: 'user' | 'admin') => {
  // Mark messages from the OTHER role as read
  const senderRole = readerRole === 'user' ? 'admin' : 'user';
  return ConversationModel.updateOne(
    { _id: conversationId },
    {
      $set: {
        'messages.$[msg].readAt': new Date(),
      },
    },
    {
      arrayFilters: [{ 'msg.senderRole': senderRole, 'msg.readAt': null }],
    }
  );
};

export const countUnreadForUser = (userId: string) => {
  return ConversationModel.countDocuments({
    user: userId,
    status: 'active',
    'messages': {
      $elemMatch: { senderRole: 'admin', readAt: null },
    },
  });
};

export const countUnreadForAdmin = () => {
  return ConversationModel.countDocuments({
    status: 'active',
    'messages': {
      $elemMatch: { senderRole: 'user', readAt: null },
    },
  });
};
