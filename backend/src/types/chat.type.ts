import { Document, Types } from 'mongoose';

export interface IMessage {
  sender: Types.ObjectId;
  senderRole: 'user' | 'admin';
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export interface IConversation extends Document {
  user: Types.ObjectId;
  product?: Types.ObjectId;
  subject: string;
  messages: IMessage[];
  status: 'active' | 'closed';
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
