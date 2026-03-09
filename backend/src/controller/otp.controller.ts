import { Request, Response } from 'express';
import { requestPasswordResetOTP, verifyOTPAndResetPassword } from '../services/otp.service';
import { ApiError } from '../exceptions/api.error';

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError('Email is required', 400);
    }

    const result = await requestPasswordResetOTP(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to send OTP',
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      throw new ApiError('Email, OTP, and password are required', 400);
    }

    if (password.length < 6) {
      throw new ApiError('Password must be at least 6 characters', 400);
    }

    const result = await verifyOTPAndResetPassword(email, otp, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to verify OTP',
    });
  }
};
