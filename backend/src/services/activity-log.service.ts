import {
  createActivityLog,
  getActivityLogs,
  getActivityLogCount,
  getActivityLogById,
  getUserActivityLogs,
  getUserActivityLogCount,
} from '../repositories/activity-log.repository';
import { IActivityLog } from '../models/activity-log.model';

export const logActivity = async (
  adminId: string,
  adminName: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW',
  targetUserId?: string,
  targetUserName?: string,
  targetUserEmail?: string,
  changes?: Record<string, any>
) => {
  try {
    const logData: IActivityLog = {
      adminId,
      adminName,
      action,
      ...(targetUserId && { targetUserId }),
      ...(targetUserName && { targetUserName }),
      ...(targetUserEmail && { targetUserEmail }),
      ...(changes && { changes }),
    };

    return await createActivityLog(logData);
  } catch (error: any) {
    // Log to console but don't throw - activity logging shouldn't break main operations
    console.error('Failed to log activity:', error.message);
    return null;
  }
};

export const fetchActivityLogs = async (
  page: number = 1,
  limit: number = 20,
  filters?: { adminId?: string; targetUserId?: string; action?: string }
) => {
  try {
    const logs = await getActivityLogs(page, limit, filters);
    const total = await getActivityLogCount(filters);
    const pages = Math.ceil(total / limit);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch activity logs');
  }
};

export const fetchUserActivityLogs = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const logs = await getUserActivityLogs(userId, page, limit);
    const total = await getUserActivityLogCount(userId);
    const pages = Math.ceil(total / limit);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user activity logs');
  }
};

export const getActivityLogDetails = async (id: string) => {
  try {
    const log = await getActivityLogById(id);
    if (!log) {
      throw new Error('Activity log not found');
    }
    return log;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch activity log details');
  }
};
