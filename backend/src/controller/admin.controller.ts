import { Request, Response } from 'express';
import {
  createNewUser,
  fetchAllUsers,
  fetchUserById,
  updateUserProfile,
  removeUser,
} from '../services/admin.service';

export const createUser = async (req: any, res: Response) => {
  try {
    const user = await createNewUser(
      req.body,
      req.file,
      req.user?.id,
      req.user?.name
    );
    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to create user',
    });
  }
};

export const listAllUsers = async (req: any, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const users = await fetchAllUsers(page, limit);
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch users',
    });
  }
};

export const getUserById = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await fetchUserById(id);
    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch user',
    });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await updateUserProfile(
      id,
      req.body,
      req.file,
      req.user?.id,
      req.user?.name
    );
    res.status(200).json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to update user',
    });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    await removeUser(id);
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to delete user',
    });
  }
};
