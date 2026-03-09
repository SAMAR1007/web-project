import { Request, Response } from 'express';
import {
  createUser,
  listAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controller/admin.controller';
import * as adminService from '../services/admin.service';

jest.mock('../services/admin.service');

describe('Admin Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      const mockCreatedUser = { _id: '123', ...mockReq.body, password: 'hashed' };
      (adminService.createNewUser as jest.Mock).mockResolvedValue(mockCreatedUser);

      await createUser(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: mockCreatedUser,
      });
    });

    it('should handle creation error', async () => {
      mockReq.body = { email: 'test@example.com' };
      const error = new Error('Email already exists');
      (error as any).statusCode = 409;

      (adminService.createNewUser as jest.Mock).mockRejectedValue(error);

      await createUser(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
    });
  });

  describe('listAllUsers', () => {
    it('should list all users without pagination', async () => {
      mockReq.query = {};

      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      (adminService.fetchAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await listAllUsers(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Users retrieved successfully',
        data: mockUsers,
      });
      expect(adminService.fetchAllUsers).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should list paginated users', async () => {
      mockReq.query = { page: '1', limit: '10' };

      const mockPaginatedUsers = {
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

      (adminService.fetchAllUsers as jest.Mock).mockResolvedValue(mockPaginatedUsers);

      await listAllUsers(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Users retrieved successfully',
        data: mockPaginatedUsers,
      });
      expect(adminService.fetchAllUsers).toHaveBeenCalledWith(1, 10);
    });

    it('should parse page and limit as numbers', async () => {
      mockReq.query = { page: '2', limit: '20' };

      const mockUsers: any[] = [];
      (adminService.fetchAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await listAllUsers(mockReq as any, mockRes as Response);

      expect(adminService.fetchAllUsers).toHaveBeenCalledWith(2, 20);
    });

    it('should handle fetch error', async () => {
      mockReq.query = {};
      const error = new Error('Database error');
      (error as any).statusCode = 500;

      (adminService.fetchAllUsers as jest.Mock).mockRejectedValue(error);

      await listAllUsers(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUserById', () => {
    it('should get user by id successfully', async () => {
      mockReq.params = { id: '123' };

      const mockUser = { _id: '123', name: 'John', email: 'john@example.com' };
      (adminService.fetchUserById as jest.Mock).mockResolvedValue(mockUser);

      await getUserById(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User retrieved successfully',
        data: mockUser,
      });
    });

    it('should throw error if user not found', async () => {
      mockReq.params = { id: 'invalid_id' };
      const error = new Error('User not found');
      (error as any).statusCode = 404;

      (adminService.fetchUserById as jest.Mock).mockRejectedValue(error);

      await getUserById(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { name: 'Updated Name' };

      const mockUpdatedUser = { _id: '123', name: 'Updated Name' };
      (adminService.updateUserProfile as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await updateUser(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        data: mockUpdatedUser,
      });
    });

    it('should handle update error', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { email: 'existing@example.com' };

      const error = new Error('Email already exists');
      (error as any).statusCode = 409;

      (adminService.updateUserProfile as jest.Mock).mockRejectedValue(error);

      await updateUser(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockReq.params = { id: '123' };

      (adminService.removeUser as jest.Mock).mockResolvedValue(undefined);

      await deleteUser(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
      expect(adminService.removeUser).toHaveBeenCalledWith('123');
    });

    it('should handle delete error', async () => {
      mockReq.params = { id: 'invalid_id' };

      const error = new Error('User not found');
      (error as any).statusCode = 404;

      (adminService.removeUser as jest.Mock).mockRejectedValue(error);

      await deleteUser(mockReq as any, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});
