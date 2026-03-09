import dotenv from 'dotenv';
import http from 'http';
import app from './index';
import { connectDB } from './config/db';
import { setupSocketIO } from './config/socket';

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    setupSocketIO(server);

    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
