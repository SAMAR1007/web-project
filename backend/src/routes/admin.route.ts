import { Router } from 'express';
import {
  createUser,
  listAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controller/admin.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../config/multer';

const router = Router();

// All admin routes are protected
router.use(verifyToken);
router.use(isAdmin);

// Admin user management endpoints
router.post('/users', upload.single('image'), createUser);
router.get('/users', listAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', upload.single('image'), updateUser);
router.delete('/users/:id', deleteUser);

export default router;
