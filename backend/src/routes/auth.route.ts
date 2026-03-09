import { Router } from 'express';
import { register, login, updateProfile, getProfile, forgotPassword, resetPasswordCtrl } from '../controller/auth.controller';
import { validate } from '../middlewares/zod.middleware';
import { registerDTO, loginDTO } from '../dtos/auth.dto';
import { verifyToken } from '../middlewares/auth.middleware';
import { upload } from '../config/multer';

const router = Router();

router.post('/register', validate(registerDTO), register);
router.post('/login', validate(loginDTO), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordCtrl);
router.get('/profile', verifyToken, getProfile);
router.put('/:id', verifyToken, upload.single('image'), updateProfile);

export default router;
