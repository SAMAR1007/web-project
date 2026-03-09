import { Schema, model } from 'mongoose';
import { IOrder, IOrderItem, IAddress } from '../types/order.type';

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const addressSchema = new Schema<IAddress>(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'Nepal',
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(val: IOrderItem[]) => val.length > 0, 'Order must contain at least one item'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['esewa', 'cash_on_delivery'],
      default: 'esewa',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>('Order', orderSchema);

