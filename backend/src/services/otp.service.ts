import { createOTP, findOTPByEmailAndOTP, deleteOTP, deleteOTPByEmail } from '../repositories/otp.repository';
import { findUserByEmail } from '../repositories/user.repository';
import { sendOTPEmail } from './email.service';
import { ApiError } from '../exceptions/api.error';

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Request OTP for password reset
 */
export const requestPasswordResetOTP = async (email: string) => {
  // Verify user exists
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError('User not found with this email', 404);
  }

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete old OTPs for this email
  await deleteOTPByEmail(email);

  // Save new OTP
  await createOTP({
    email,
    otp,
    type: 'password_reset',
    expiresAt,
  });

  // Send OTP via email
  const sent = await sendOTPEmail(email, otp);

  if (!sent) {
    throw new ApiError('Failed to send OTP to email', 500);
  }

  return {
    message: 'OTP sent successfully to your email',
    expiresIn: '10 minutes',
  };
};

/**
 * Verify OTP and reset password
 */
export const verifyOTPAndResetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  // Find OTP
  const otpRecord = await findOTPByEmailAndOTP(email, otp);

  if (!otpRecord) {
    throw new ApiError('Invalid OTP', 400);
  }

  // Check if expired
  if (new Date() > otpRecord.expiresAt) {
    await deleteOTP(email, otp);
    throw new ApiError('OTP has expired', 400);
  }

  // Find user and update password
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Hash new password
  const { hashPassword } = await import('../utils/hash.util');
  const hashedPassword = await hashPassword(newPassword);

  // Update user password
  user.password = hashedPassword;
  await user.save();

  // Delete used OTP
  await deleteOTP(email, otp);

  return {
    message: 'Password reset successful',
  };
};
