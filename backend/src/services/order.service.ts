import { createOrder as repoCreateOrder, findAllOrders, findOrdersByUserId } from '../repositories/order.repository';
import { findProductById } from '../repositories/product.repository';
import { ApiError } from '../exceptions/api.error';
import { IOrderItem, IAddress } from '../types/order.type';
import { OrderModel } from '../models/order.model';

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  items: CreateOrderItemInput[];
  shippingAddress: IAddress;
  paymentMethod: 'esewa' | 'cash_on_delivery';
}

export const createOrderForUser = async (userId: string, orderData: CreateOrderInput) => {
  if (!userId) {
    throw new ApiError('User is required to place an order', 400);
  }

  const { items, shippingAddress, paymentMethod } = orderData;

  if (!items || items.length === 0) {
    throw new ApiError('Order must contain at least one item', 400);
  }

  if (!shippingAddress) {
    throw new ApiError('Shipping address is required', 400);
  }

  // Validate shipping address
  const { fullName, phoneNumber, street, city, state, postalCode } = shippingAddress;
  if (!fullName || !phoneNumber || !street || !city || !state || !postalCode) {
    throw new ApiError('All address fields are required', 400);
  }

  const orderItems: IOrderItem[] = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await findProductById(item.productId);
    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const priceAtPurchase = product.price;
    const subtotal = priceAtPurchase * quantity;

    totalAmount += subtotal;

    orderItems.push({
      product: product._id,
      quantity,
      priceAtPurchase,
      subtotal,
    });
  }

  return repoCreateOrder({
    user: userId as any,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'esewa' ? 'pending' : 'completed',
    status: paymentMethod === 'esewa' ? 'pending' : 'processing',
  } as any);
};

export const getOrdersForUser = async (userId: string) => {
  if (!userId) {
    throw new ApiError('User is required', 400);
  }
  return findOrdersByUserId(userId);
};

export const getAllOrdersForAdmin = async () => {
  return findAllOrders();
};

export const updateOrderPaymentStatus = async (orderId: string, transactionId: string, paymentStatus: 'completed' | 'failed') => {
  if (!orderId) {
    throw new ApiError('Order ID is required', 400);
  }

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    {
      paymentStatus,
      transactionId,
      status: paymentStatus === 'completed' ? 'processing' : 'cancelled',
    },
    { new: true }
  );

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  return order;
};

export const updateOrderStatusForAdmin = async (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
  if (!orderId) {
    throw new ApiError('Order ID is required', 400);
  }

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  )
    .populate('user', 'name email phoneNumber')
    .populate('items.product', 'name price category');

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  return order;
};

