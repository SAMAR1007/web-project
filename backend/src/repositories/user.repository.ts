import { UserModel } from '../models/user.model';
import { IUser } from '../types/user.type';

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const findUserByPhone = (phoneNumber: string) => {
  return UserModel.findOne({ phoneNumber });
};

export const createUser = (data: IUser) => {
  return UserModel.create(data);
};

export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

export const getAllUsers = () => {
  return UserModel.find().select('-password');
};

export const getAllUsersWithPagination = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const users = await UserModel.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  const total = await UserModel.countDocuments();
  const pages = Math.ceil(total / limit);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  };
};

export const updateUser = (id: string, data: Partial<IUser>) => {
  return UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
};

export const deleteUser = (id: string) => {
  return UserModel.findByIdAndDelete(id);
};

export const findUserByResetToken = (resetToken: string) => {
  return UserModel.findOne({
    resetToken,
    resetTokenExpiry: { $gt: new Date() }, // Token must not be expired
  });
};

export const updateResetToken = (
  email: string,
  resetToken: string,
  resetTokenExpiry: Date
) => {
  return UserModel.findOneAndUpdate(
    { email },
    { resetToken, resetTokenExpiry },
    { new: true }
  ).select('-password');
};

export const clearResetToken = (id: string) => {
  return UserModel.findByIdAndUpdate(
    id,
    { resetToken: null, resetTokenExpiry: null },
    { new: true }
  ).select('-password');
};
