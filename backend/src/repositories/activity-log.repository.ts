import { ActivityLogModel, IActivityLog } from '../models/activity-log.model';

export const createActivityLog = (data: IActivityLog) => {
  return ActivityLogModel.create(data);
};

export const getActivityLogs = (
  page: number = 1,
  limit: number = 20,
  filters?: { adminId?: string; targetUserId?: string; action?: string }
) => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filters?.adminId) {
    query.adminId = filters.adminId;
  }
  if (filters?.targetUserId) {
    query.targetUserId = filters.targetUserId;
  }
  if (filters?.action) {
    query.action = filters.action;
  }

  return ActivityLogModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const getActivityLogCount = (filters?: { adminId?: string; targetUserId?: string; action?: string }) => {
  const query: any = {};

  if (filters?.adminId) {
    query.adminId = filters.adminId;
  }
  if (filters?.targetUserId) {
    query.targetUserId = filters.targetUserId;
  }
  if (filters?.action) {
    query.action = filters.action;
  }

  return ActivityLogModel.countDocuments(query);
};

export const getActivityLogById = (id: string) => {
  return ActivityLogModel.findById(id);
};

export const getUserActivityLogs = (userId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  return ActivityLogModel.find({ targetUserId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const getUserActivityLogCount = (userId: string) => {
  return ActivityLogModel.countDocuments({ targetUserId: userId });
};

export const deleteOldActivityLogs = (days: number = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return ActivityLogModel.deleteMany({
    createdAt: { $lt: cutoffDate },
  });
};
