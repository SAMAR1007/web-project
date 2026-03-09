import { Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'esewa' | 'cash_on_delivery';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface IAddress {
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

