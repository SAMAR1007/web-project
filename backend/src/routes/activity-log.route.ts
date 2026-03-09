import { Router } from 'express';
import {
  getActivityLogs,
  getUserActivityLogs,
  getActivityLogDetail,
} from '../controller/activity-log.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All activity log routes are protected and require admin role
router.use(verifyToken);
router.use(isAdmin);

// Get all activity logs with pagination and filtering
router.get('/', getActivityLogs);

// Get activity logs for a specific user
router.get('/user/:userId', getUserActivityLogs);

// Get details of a specific activity log
router.get('/:id', getActivityLogDetail);

export default router;
