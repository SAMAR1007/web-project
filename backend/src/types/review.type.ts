import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
