import {
  findUserByEmail,
  findUserByPhone,
  createUser,
  findUserById,
  getAllUsers,
  getAllUsersWithPagination,
  updateUser,
  deleteUser,
  findUserByResetToken,
  updateResetToken,
  clearResetToken,
} from '../repositories/user.repository';

jest.mock('../models/user.model');

import { UserModel } from '../models/user.model';

describe('User Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = { _id: '123', email: 'john@example.com', name: 'John' };
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserByEmail('john@example.com');

      expect(result).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should return null if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findUserByPhone', () => {
    it('should find user by phone number', async () => {
      const mockUser = { _id: '123', phoneNumber: '1234567890', name: 'John' };
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserByPhone('1234567890');

      expect(result).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({ phoneNumber: '1234567890' });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'hashed_password',
        role: 'user',
      };

      const mockCreatedUser = { _id: '123', ...userData };
      (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await createUser(userData as any);

      expect(result).toEqual(mockCreatedUser);
      expect(UserModel.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      const mockUser = { _id: '123', name: 'John' };
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserById('123');

      expect(result).toEqual(mockUser);
      expect(UserModel.findById).toHaveBeenCalledWith('123');
    });

    it('should return null if user not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await findUserById('invalid_id');

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockUsers),
      };
      (UserModel.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(UserModel.find).toHaveBeenCalled();
      expect(mockChain.select).toHaveBeenCalledWith('-password');
    });
  });

  describe('getAllUsersWithPagination', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockUsers),
      };

      (UserModel.find as jest.Mock).mockReturnValue(mockChain);
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(25);

      const result = await getAllUsersWithPagination(1, 10);

      expect(result.data).toEqual(mockUsers);
      expect(result.pagination).toEqual({
        total: 25,
        page: 1,
        limit: 10,
        pages: 3,
      });
      expect(mockChain.skip).toHaveBeenCalledWith(0);
      expect(mockChain.limit).toHaveBeenCalledWith(10);
    });

    it('should calculate correct skip value for page 2', async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };

      (UserModel.find as jest.Mock).mockReturnValue(mockChain);
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(50);

      await getAllUsersWithPagination(2, 10);

      expect(mockChain.skip).toHaveBeenCalledWith(10); // (2-1) * 10
    });

    it('should calculate correct number of pages', async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };

      (UserModel.find as jest.Mock).mockReturnValue(mockChain);
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(105);

      const result = await getAllUsersWithPagination(1, 10);

      expect(result.pagination.pages).toBe(11); // Math.ceil(105/10)
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const updatedData = { name: 'Updated Name' };
      const mockUpdatedUser = { _id: '123', name: 'Updated Name', email: 'john@example.com' };

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockUpdatedUser),
      };
      (UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue(mockChain);

      const result = await updateUser('123', updatedData as any);

      expect(result).toEqual(mockUpdatedUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('123', updatedData, { new: true });
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const mockDeletedUser = { _id: '123', name: 'John' };
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedUser);

      const result = await deleteUser('123');

      expect(result).toEqual(mockDeletedUser);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('findUserByResetToken', () => {
    it('should find user by valid reset token', async () => {
      const resetToken = 'valid-token';
      const mockUser = { _id: '123', email: 'john@example.com', resetToken };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserByResetToken(resetToken);

      expect(result).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalled();
    });

    it('should not find user with expired reset token', async () => {
      const resetToken = 'expired-token';

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await findUserByResetToken(resetToken);

      expect(result).toBeNull();
    });
  });

  describe('updateResetToken', () => {
    it('should update reset token and expiry', async () => {
      const email = 'john@example.com';
      const resetToken = 'new-token';
      const resetTokenExpiry = new Date();
      const mockUpdatedUser = { _id: '123', email, resetToken, resetTokenExpiry };

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockUpdatedUser),
      };
      (UserModel.findOneAndUpdate as jest.Mock).mockReturnValue(mockChain);

      const result = await updateResetToken(email, resetToken, resetTokenExpiry);

      expect(result).toEqual(mockUpdatedUser);
      expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email },
        { resetToken, resetTokenExpiry },
        { new: true }
      );
    });
  });

  describe('clearResetToken', () => {
    it('should clear reset token', async () => {
      const userId = '123';
      const mockUpdatedUser = { _id: userId, email: 'john@example.com', resetToken: null };

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockUpdatedUser),
      };
      (UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue(mockChain);

      const result = await clearResetToken(userId);

      expect(result).toEqual(mockUpdatedUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { resetToken: null, resetTokenExpiry: null },
        { new: true }
      );
    });
  });
});
