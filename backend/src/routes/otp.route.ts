import { Router } from 'express';
import { requestOTP, verifyOTP } from '../controller/otp.controller';

const router = Router();

router.post('/request', requestOTP);
router.post('/verify', verifyOTP);

export default router;
