import { Request, Response } from 'express';
import { registerUser, loginUser, requestPasswordReset, resetPassword } from '../services/auth.service';
import { updateUserProfile, fetchUserById } from '../services/admin.service';
import { ApiError } from '../exceptions/api.error';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Login failed',
    });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    const user = await fetchUserById(req.user.id);
    res.status(200).json({
      message: 'Profile fetched successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch profile',
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    const user = await updateUserProfile(req.user.id, req.body, req.file);
    res.status(200).json({
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to update profile',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw new ApiError('Email is required', 400);
    }

    const result = await requestPasswordReset(email);
    res.status(200).json({
      message: result.message,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to process password reset request',
    });
  }
};

export const resetPasswordCtrl = async (req: Request, res: Response) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      throw new ApiError('Reset token and password are required', 400);
    }

    if (password.length < 6) {
      throw new ApiError('Password must be at least 6 characters', 400);
    }

    const result = await resetPassword(resetToken, password);
    res.status(200).json({
      message: result.message,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to reset password',
    });
  }
};
