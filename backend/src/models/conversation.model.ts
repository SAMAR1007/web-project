import mongoose from 'mongoose';
import { IConversation } from '../types/chat.type';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['user', 'admin'], required: true },
    content: { type: String, required: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    subject: { type: String, required: true },
    messages: [messageSchema],
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema);
