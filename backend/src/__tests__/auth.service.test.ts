import { registerUser, loginUser, requestPasswordReset, resetPassword } from '../services/auth.service';
import * as userRepository from '../repositories/user.repository';
import * as emailService from '../services/email.service';
import { ApiError } from '../exceptions/api.error';

// Mock repositories and services
jest.mock('../repositories/user.repository');
jest.mock('../services/email.service');
jest.mock('../utils/hash.util');

import { hashPassword, comparePassword } from '../utils/hash.util';
import { generateToken } from '../lib/jwt';

jest.mock('../lib/jwt');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        role: 'user',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findUserByPhone as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        _id: '123',
        ...userPayload,
        password: 'hashed_password',
      });

      const result = await registerUser(userPayload);

      expect(result).toBeDefined();
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(userPayload.email);
      expect(userRepository.findUserByPhone).toHaveBeenCalledWith(userPayload.phoneNumber);
      expect(hashPassword).toHaveBeenCalledWith(userPayload.password);
      expect(userRepository.createUser).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const userPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue({ email: userPayload.email });

      await expect(registerUser(userPayload)).rejects.toThrow('Email already exists');
    });

    it('should throw error if phone already exists', async () => {
      const userPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findUserByPhone as jest.Mock).mockResolvedValue({ phoneNumber: userPayload.phoneNumber });

      await expect(registerUser(userPayload)).rejects.toThrow('Phone number already exists');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const loginPayload = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '123',
        email: loginPayload.email,
        password: 'hashed_password',
        role: 'user',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mock_token');

      const result = await loginUser(loginPayload);

      expect(result).toEqual({ token: 'mock_token' });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(loginPayload.email);
      expect(comparePassword).toHaveBeenCalledWith(loginPayload.password, mockUser.password);
    });

    it('should throw error for invalid email', async () => {
      const loginPayload = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(loginUser(loginPayload)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const loginPayload = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        _id: '123',
        email: loginPayload.email,
        password: 'hashed_password',
        role: 'user',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(loginUser(loginPayload)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const email = 'john@example.com';
      const mockUser = { _id: '123', email, name: 'John Doe' };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.updateResetToken as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendPasswordResetEmail as jest.Mock).mockResolvedValue(true);

      const result = await requestPasswordReset(email);

      expect(result).toEqual({ message: 'Password reset link sent to your email' });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.updateResetToken).toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const email = 'nonexistent@example.com';

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(requestPasswordReset(email)).rejects.toThrow('User not found with this email');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetToken = 'valid-reset-token';
      const newPassword = 'newpassword123';

      const mockUser = {
        _id: '123',
        email: 'john@example.com',
        password: 'hashed_password',
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 1000),
        save: jest.fn(),
      };

      (userRepository.findUserByResetToken as jest.Mock).mockResolvedValue(mockUser);
      (hashPassword as jest.Mock).mockResolvedValue('new_hashed_password');
      (userRepository.clearResetToken as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await resetPassword(resetToken, newPassword);

      expect(result).toEqual({ message: 'Password reset successfully' });
      expect(userRepository.findUserByResetToken).toHaveBeenCalledWith(resetToken);
      expect(hashPassword).toHaveBeenCalledWith(newPassword);
    });

    it('should throw error for invalid reset token', async () => {
      const resetToken = 'invalid-token';
      const newPassword = 'newpassword123';

      (userRepository.findUserByResetToken as jest.Mock).mockResolvedValue(null);

      await expect(resetPassword(resetToken, newPassword)).rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw error for expired reset token', async () => {
      const resetToken = 'expired-token';
      const newPassword = 'newpassword123';

      (userRepository.findUserByResetToken as jest.Mock).mockResolvedValue(null);

      await expect(resetPassword(resetToken, newPassword)).rejects.toThrow('Invalid or expired reset token');
    });
  });
});
