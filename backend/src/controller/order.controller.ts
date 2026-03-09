import { Request, Response } from 'express';
import { createOrderForUser, getAllOrdersForAdmin, getOrdersForUser, updateOrderPaymentStatus, updateOrderStatusForAdmin } from '../services/order.service';
import { IAddress } from '../types/order.type';
import { buildEsewaPaymentData, verifyEsewaPaymentData } from '../services/esewa.service';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { items, shippingAddress, paymentMethod } = req.body as {
      items: { productId: string; quantity: number }[];
      shippingAddress: IAddress;
      paymentMethod: 'esewa' | 'cash_on_delivery';
    };

    const order = await createOrderForUser(userId as string, {
      items,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to place order',
    });
  }
};

export const listUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const orders = await getOrdersForUser(userId);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch orders',
    });
  }
};

export const listAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await getAllOrdersForAdmin();

    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch orders',
    });
  }
};

export const initiateEsewaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, amount } = req.body as {
      orderId: string;
      amount: number;
    };

    if (!orderId || !amount) {
      res.status(400).json({ message: 'orderId and amount are required' });
      return;
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const paymentData = buildEsewaPaymentData({
      orderId,
      amount,
      successUrl: `${baseUrl}/checkout/success`,
      failureUrl: `${baseUrl}/checkout/failure`,
    });

    res.status(200).json({
      message: 'Payment data generated',
      data: paymentData,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to initiate payment',
    });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, transactionId, status, encodedData } = req.body as {
      orderId: string;
      transactionId: string;
      status: 'completed' | 'failed';
      encodedData?: string;
    };

    // If encodedData from eSewa v2 is provided, verify the signature
    if (encodedData) {
      const verification = verifyEsewaPaymentData(encodedData);
      if (!verification.valid) {
        res.status(400).json({ message: 'Invalid eSewa payment data' });
        return;
      }
      // Use the transaction code from eSewa response
      const txnId = verification.transactionCode || transactionId;
      const order = await updateOrderPaymentStatus(
        orderId,
        txnId,
        verification.status === 'COMPLETE' ? 'completed' : 'failed',
      );
      res.status(200).json({
        message: 'Payment verified successfully',
        data: order,
      });
      return;
    }

    const order = await updateOrderPaymentStatus(orderId, transactionId, status);

    res.status(200).json({
      message: 'Payment verified successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to verify payment',
    });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { status } = req.body as { status: 'pending' | 'processing' | 'completed' | 'cancelled' };

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const order = await updateOrderStatusForAdmin(orderId, status);

    res.status(200).json({
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to update order status',
    });
  }
};

