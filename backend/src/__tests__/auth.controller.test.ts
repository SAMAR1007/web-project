import { Request, Response } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPasswordCtrl,
  getProfile,
  updateProfile,
} from '../controller/auth.controller';
import * as authService from '../services/auth.service';
import * as adminService from '../services/admin.service';

jest.mock('../services/auth.service');
jest.mock('../services/admin.service');

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      mockReq.body = userData;
      (authService.registerUser as jest.Mock).mockResolvedValue({ _id: '123', ...userData });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: expect.any(Object),
      });
    });

    it('should handle registration error', async () => {
      mockReq.body = { email: 'test@example.com' };
      const error = new Error('Email already exists');
      (error as any).statusCode = 409;

      (authService.registerUser as jest.Mock).mockRejectedValue(error);

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'password123',
      };

      (authService.loginUser as jest.Mock).mockResolvedValue({ token: 'jwt_token' });

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        data: { token: 'jwt_token' },
      });
    });

    it('should handle login error', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      (error as any).statusCode = 401;

      (authService.loginUser as jest.Mock).mockRejectedValue(error);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email successfully', async () => {
      mockReq.body = { email: 'john@example.com' };

      (authService.requestPasswordReset as jest.Mock).mockResolvedValue({
        message: 'Password reset link sent to your email',
      });

      await forgotPassword(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password reset link sent to your email',
      });
    });

    it('should throw error if email not provided', async () => {
      mockReq.body = {};

      await forgotPassword(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should throw error if user not found', async () => {
      mockReq.body = { email: 'nonexistent@example.com' };

      const error = new Error('User not found with this email');
      (error as any).statusCode = 404;

      (authService.requestPasswordReset as jest.Mock).mockRejectedValue(error);

      await forgotPassword(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockReq.body = {
        resetToken: 'valid-token',
        password: 'newpassword123',
      };

      (authService.resetPassword as jest.Mock).mockResolvedValue({
        message: 'Password reset successfully',
      });

      await resetPasswordCtrl(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password reset successfully',
      });
    });

    it('should throw error if reset token not provided', async () => {
      mockReq.body = { password: 'newpassword' };

      await resetPasswordCtrl(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should throw error if password not provided', async () => {
      mockReq.body = { resetToken: 'token' };

      await resetPasswordCtrl(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should throw error if password too short', async () => {
      mockReq.body = {
        resetToken: 'valid-token',
        password: '123', // Too short
      };

      await resetPasswordCtrl(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should throw error for invalid reset token', async () => {
      mockReq.body = {
        resetToken: 'invalid-token',
        password: 'newpassword123',
      };

      const error = new Error('Invalid or expired reset token');
      (error as any).statusCode = 400;

      (authService.resetPassword as jest.Mock).mockRejectedValue(error);

      await resetPasswordCtrl(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      (mockReq as any).user = { id: '123', role: 'user' };

      const mockUser = { _id: '123', name: 'John', email: 'john@example.com' };
      (adminService.fetchUserById as jest.Mock).mockResolvedValue(mockUser);

      await getProfile(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Profile fetched successfully',
        data: mockUser,
      });
    });

    it('should throw error if user not authenticated', async () => {
      (mockReq as any).user = null;

      await getProfile(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      (mockReq as any).user = { id: '123', role: 'user' };
      mockReq.body = { name: 'Updated Name' };

      const mockUpdatedUser = { _id: '123', name: 'Updated Name' };
      (adminService.updateUserProfile as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await updateProfile(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        data: mockUpdatedUser,
      });
    });

    it('should throw error if user not authenticated', async () => {
      (mockReq as any).user = null;

      await updateProfile(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });
});
