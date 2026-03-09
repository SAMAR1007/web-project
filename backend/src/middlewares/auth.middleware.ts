import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../exceptions/api.error';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      message: error.message || 'Invalid token',
    });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    if (req.user.role !== 'admin') {
      throw new ApiError('Unauthorized - Admin access required', 403);
    }

    next();
  } catch (error: any) {
    res.status(error.statusCode || 403).json({
      message: error.message || 'Access denied',
    });
  }
};

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      message: error.message || 'Unauthorized',
    });
  }
};
