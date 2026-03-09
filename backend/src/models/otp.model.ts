import { Schema, model } from 'mongoose';

export interface IOTP {
  _id?: string;
  email: string;
  otp: string;
  type: 'password_reset' | 'email_verification';
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['password_reset', 'email_verification'],
      default: 'password_reset',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index for auto deletion
    },
  },
  { timestamps: true }
);

export const OTPModel = model<IOTP>('OTP', otpSchema);
