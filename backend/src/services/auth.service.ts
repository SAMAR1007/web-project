import {
  findUserByEmail,
  findUserByPhone,
  createUser,
  findUserByResetToken,
  updateResetToken,
  clearResetToken,
} from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { generateToken } from '../lib/jwt';
import { ApiError } from '../exceptions/api.error';
import { sendPasswordResetEmail } from './email.service';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (payload: any) => {
  const emailExists = await findUserByEmail(payload.email);
  if (emailExists) {
    throw new ApiError('Email already exists', 409);
  }

  const phoneExists = await findUserByPhone(payload.phoneNumber);
  if (phoneExists) {
    throw new ApiError('Phone number already exists', 409);
  }

  const hashedPassword = await hashPassword(payload.password);

  return createUser({
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
    role: payload.role || 'user',
  });
};

export const loginUser = async (payload: any) => {
  const user = await findUserByEmail(payload.email);

  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  const isMatch = await comparePassword(payload.password, user.password);
  if (!isMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  return {
    token: generateToken({
      id: user._id,
      role: user.role,
    }),
  };
};

export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError('User not found with this email', 404);
  }

  // Generate reset token (UUID)
  const resetToken = uuidv4();
  
  // Token expires in 1 hour
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  // Save reset token to user
  await updateResetToken(email, resetToken, resetTokenExpiry);

  // Send email with reset link
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(email, resetToken, resetLink);

  return {
    message: 'Password reset link sent to your email',
  };
};

export const resetPassword = async (resetToken: string, newPassword: string) => {
  // Find user by reset token (token must not be expired)
  const user = await findUserByResetToken(resetToken);

  if (!user) {
    throw new ApiError('Invalid or expired reset token', 400);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await clearResetToken(user._id.toString());

  // Update password
  const updatedUser = await findUserByEmail(user.email);
  if (updatedUser) {
    updatedUser.password = hashedPassword;
    updatedUser.resetToken = null;
    updatedUser.resetTokenExpiry = null;
    await updatedUser.save();
  }

  return {
    message: 'Password reset successfully',
  };
};
