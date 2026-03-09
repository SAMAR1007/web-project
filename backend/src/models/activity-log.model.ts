import { Schema, model } from 'mongoose';

export interface IActivityLog {
  _id?: string;
  adminId: string;
  adminName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;
  changes?: Record<string, any>;
  timestamp?: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    adminId: {
      type: String,
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW'],
      required: true,
    },
    targetUserId: {
      type: String,
      default: null,
    },
    targetUserName: {
      type: String,
      default: null,
    },
    targetUserEmail: {
      type: String,
      default: null,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ adminId: 1, createdAt: -1 });
activityLogSchema.index({ targetUserId: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLogModel = model<IActivityLog>('ActivityLog', activityLogSchema);
