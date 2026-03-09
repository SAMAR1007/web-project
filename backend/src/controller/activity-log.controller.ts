import { Request, Response } from 'express';
import {
  fetchActivityLogs,
  fetchUserActivityLogs,
  getActivityLogDetails,
} from '../services/activity-log.service';
import { ApiError } from '../exceptions/api.error';

export const getActivityLogs = async (req: any, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const action = req.query.action as string;
    const adminId = req.query.adminId as string;
    const targetUserId = req.query.targetUserId as string;

    const filters: any = {};
    if (action) filters.action = action;
    if (adminId) filters.adminId = adminId;
    if (targetUserId) filters.targetUserId = targetUserId;

    const result = await fetchActivityLogs(page, limit, filters);

    res.status(200).json({
      message: 'Activity logs retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to retrieve activity logs',
    });
  }
};

export const getUserActivityLogs = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await fetchUserActivityLogs(userId, page, limit);

    res.status(200).json({
      message: 'User activity logs retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to retrieve user activity logs',
    });
  }
};

export const getActivityLogDetail = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const log = await getActivityLogDetails(id);

    res.status(200).json({
      message: 'Activity log details retrieved successfully',
      data: log,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to retrieve activity log details',
    });
  }
};
