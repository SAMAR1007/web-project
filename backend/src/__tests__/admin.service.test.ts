import {
  createNewUser,
  fetchAllUsers,
  fetchUserById,
  updateUserProfile,
  removeUser,
} from '../services/admin.service';
import * as userRepository from '../repositories/user.repository';
import { ApiError } from '../exceptions/api.error';

jest.mock('../repositories/user.repository');
jest.mock('../utils/hash.util');

import { hashPassword } from '../utils/hash.util';

describe('Admin Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {
    it('should create a new user successfully', async () => {
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

      const result = await createNewUser(userPayload);

      expect(result).toBeDefined();
      expect(result._id).toBe('123');
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

      await expect(createNewUser(userPayload)).rejects.toThrow('Email already exists');
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

      await expect(createNewUser(userPayload)).rejects.toThrow('Phone number already exists');
    });

    it('should include image path if file provided', async () => {
      const userPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      const mockFile = {
        originalname: 'profile.jpg',
        filename: 'profile-1234.jpg',
      } as Express.Multer.File;

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findUserByPhone as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (userRepository.createUser as jest.Mock).mockImplementation((data) => {
        return Promise.resolve({
          _id: '123',
          ...data,
        });
      });

      await createNewUser(userPayload, mockFile);

      const createCall = (userRepository.createUser as jest.Mock).mock.calls[0][0];
      expect(createCall.image).toBe('/uploads/profile-1234.jpg');
    });
  });

  describe('fetchAllUsers', () => {
    it('should fetch all users without pagination params', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      (userRepository.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await fetchAllUsers();

      expect(result).toEqual(mockUsers);
      expect(userRepository.getAllUsers).toHaveBeenCalled();
    });

    it('should fetch paginated users when pagination params provided', async () => {
      const mockPaginatedResult = {
        data: [
          { _id: '1', name: 'User 1', email: 'user1@example.com' },
          { _id: '2', name: 'User 2', email: 'user2@example.com' },
        ],
        pagination: {
          total: 25,
          page: 1,
          limit: 10,
          pages: 3,
        },
      };

      (userRepository.getAllUsersWithPagination as jest.Mock).mockResolvedValue(mockPaginatedResult);

      const result = await fetchAllUsers(1, 10);

      expect(result).toEqual(mockPaginatedResult);
      expect(userRepository.getAllUsersWithPagination).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('fetchUserById', () => {
    it('should fetch user by id', async () => {
      const mockUser = { _id: '123', name: 'John', email: 'john@example.com' };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);

      const result = await fetchUserById('123');

      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

      await expect(fetchUserById('invalid_id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = '123';
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        phoneNumber: '9876543210',
      };

      const mockUser = {
        _id: userId,
        name: 'John',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      };

      const mockUpdatedUser = {
        _id: userId,
        ...updateData,
      };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findUserByPhone as jest.Mock).mockResolvedValue(null);
      (userRepository.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await updateUserProfile(userId, updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(userRepository.updateUser).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

      await expect(updateUserProfile('invalid_id', {})).rejects.toThrow('User not found');
    });

    it('should throw error if new email already exists', async () => {
      const userId = '123';
      const updateData = { email: 'existing@example.com' };

      const mockUser = {
        _id: userId,
        email: 'john@example.com',
      };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

      await expect(updateUserProfile(userId, updateData)).rejects.toThrow('Email already exists');
    });

    it('should update password if provided', async () => {
      const userId = '123';
      const updateData = {
        name: 'John',
        password: 'newpassword123',
      };

      const mockUser = {
        _id: userId,
        name: 'John',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      };

      const mockUpdatedUser = {
        ...mockUser,
        password: 'hashed_new_password',
      };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (hashPassword as jest.Mock).mockResolvedValue('hashed_new_password');
      (userRepository.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await updateUserProfile(userId, updateData);

      expect(hashPassword).toHaveBeenCalledWith('newpassword123');
      expect(userRepository.updateUser).toHaveBeenCalled();
    });
  });

  describe('removeUser', () => {
    it('should remove user successfully', async () => {
      const userId = '123';
      const mockUser = { _id: userId, name: 'John' };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.deleteUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await removeUser(userId);

      expect(result).toEqual(mockUser);
      expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user not found', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

      await expect(removeUser('invalid_id')).rejects.toThrow('User not found');
    });
  });
});
