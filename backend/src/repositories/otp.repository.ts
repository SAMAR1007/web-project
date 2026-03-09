import { OTPModel, IOTP } from '../models/otp.model';

export const createOTP = async (data: IOTP) => {
  return OTPModel.create(data);
};

export const findOTPByEmailAndOTP = async (email: string, otp: string) => {
  return OTPModel.findOne({ email: email.toLowerCase(), otp });
};

export const deleteOTP = async (email: string, otp: string) => {
  return OTPModel.deleteOne({ email: email.toLowerCase(), otp });
};

export const deleteOTPByEmail = async (email: string) => {
  return OTPModel.deleteMany({ email: email.toLowerCase() });
};

export const findOTPByEmail = async (email: string) => {
  return OTPModel.findOne({ email: email.toLowerCase() });
};
