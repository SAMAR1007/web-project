import { OrderModel } from '../models/order.model';
import { IOrder } from '../types/order.type';

export const createOrder = (data: Partial<IOrder>) => {
  return OrderModel.create(data);
};

export const findOrdersByUserId = (userId: string) => {
  return OrderModel.find({ user: userId })
    .populate('items.product', 'name price category')
    .sort({ createdAt: -1 });
};

export const findAllOrders = () => {
  return OrderModel.find()
    .populate('user', 'name email phoneNumber')
    .populate('items.product', 'name price category')
    .sort({ createdAt: -1 });
};

