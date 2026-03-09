import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import activityLogRoutes from './routes/activity-log.route';
import otpRoutes from './routes/otp.route';
import productRoutes from './routes/product.route';
import productsPublicRoutes from './routes/products-public.route';
import orderRoutes from './routes/order.route';
import reviewRoutes from './routes/review.route';
import chatRoutes from './routes/chat.route';

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.66:3000'], // Allow frontend origins
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/activity-logs', activityLogRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/products', productsPublicRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

export default app;
