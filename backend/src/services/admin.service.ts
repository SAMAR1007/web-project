import {
  findUserById,
  getAllUsers,
  getAllUsersWithPagination,
  updateUser,
  deleteUser,
  createUser,
  findUserByEmail,
  findUserByPhone,
} from '../repositories/user.repository';
import { hashPassword } from '../utils/hash.util';
import { ApiError } from '../exceptions/api.error';
import { logActivity } from './activity-log.service';

export const createNewUser = async (payload: any, imageFile?: Express.Multer.File, adminId?: string, adminName?: string) => {
  // Check if email already exists
  const emailExists = await findUserByEmail(payload.email);
  if (emailExists) {
    throw new ApiError('Email already exists', 409);
  }

  // Check if phone already exists
  const phoneExists = await findUserByPhone(payload.phoneNumber);
  if (phoneExists) {
    throw new ApiError('Phone number already exists', 409);
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
    role: payload.role || 'user',
    image: imageFile ? `/uploads/${imageFile.filename}` : null,
  };

  const createdUser = await createUser(userData);

  // Log activity
  if (adminId && adminName) {
    await logActivity(
      adminId,
      adminName,
      'CREATE',
      createdUser._id.toString(),
      createdUser.name,
      createdUser.email,
      { role: createdUser.role }
    );
  }

  return createdUser;
};

export const fetchAllUsers = async (page?: number, limit?: number) => {
  // If pagination params provided, use pagination
  if (page !== undefined && limit !== undefined) {
    return getAllUsersWithPagination(page, limit);
  }
  // Otherwise return all users (for backward compatibility)
  return getAllUsers();
};

export const fetchUserById = async (id: string) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  return user;
};

export const updateUserProfile = async (
  id: string,
  payload: any,
  imageFile?: Express.Multer.File,
  adminId?: string,
  adminName?: string
) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Check if new email already exists (and it's different from current)
  if (payload.email && payload.email !== user.email) {
    const emailExists = await findUserByEmail(payload.email);
    if (emailExists) {
      throw new ApiError('Email already exists', 409);
    }
  }

  // Check if new phone already exists (and it's different from current)
  if (payload.phoneNumber && payload.phoneNumber !== user.phoneNumber) {
    const phoneExists = await findUserByPhone(payload.phoneNumber);
    if (phoneExists) {
      throw new ApiError('Phone number already exists', 409);
    }
  }

  const updateData: any = {
    name: payload.name || user.name,
    email: payload.email || user.email,
    phoneNumber: payload.phoneNumber || user.phoneNumber,
  };

  // Track changes
  const changes: any = {};
  if (payload.name && payload.name !== user.name) changes.name = payload.name;
  if (payload.email && payload.email !== user.email) changes.email = payload.email;
  if (payload.phoneNumber && payload.phoneNumber !== user.phoneNumber)
    changes.phoneNumber = payload.phoneNumber;
  if (imageFile) changes.image = 'Updated';

  // Only update password if provided
  if (payload.password) {
    updateData.password = await hashPassword(payload.password);
    changes.password = 'Updated';
  }

  // Update image if file provided
  if (imageFile) {
    updateData.image = `/uploads/${imageFile.filename}`;
  }

  const updatedUser = await updateUser(id, updateData);

  // Log activity
  if (adminId && adminName && updatedUser && Object.keys(changes).length > 0) {
    await logActivity(adminId, adminName, 'UPDATE', id, updatedUser.name, updatedUser.email, changes);
  }

  return updatedUser;
};

export const removeUser = async (id: string, adminId?: string, adminName?: string) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const deletedUser = await deleteUser(id);

  // Log activity
  if (adminId && adminName) {
    await logActivity(adminId, adminName, 'DELETE', id, user.name, user.email);
  }

  return deletedUser;
};
