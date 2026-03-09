import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

interface SocketUser {
  id: string;
  role: string;
}

export const setupSocketIO = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://192.168.1.66:3000'],
      credentials: true,
    },
  });

  // Authentication middleware for socket connections
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as SocketUser;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as SocketUser;
    console.log(`User connected: ${user.id} (${user.role})`);

    // Join user's personal room
    socket.join(`user:${user.id}`);

    // Admins join the admin room
    if (user.role === 'admin') {
      socket.join('admins');
    }

    // Join a conversation room
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle new message - broadcast to conversation room
    socket.on('send-message', (data: { conversationId: string; message: any }) => {
      // Broadcast to everyone in the conversation room except sender
      socket.to(`conversation:${data.conversationId}`).emit('new-message', {
        conversationId: data.conversationId,
        message: data.message,
      });

      // Notify admins about new user messages
      if (user.role === 'user') {
        socket.to('admins').emit('conversation-updated', {
          conversationId: data.conversationId,
        });
      }

      // Notify the user about admin replies
      if (user.role === 'admin' && data.message?.conversation?.user) {
        const targetUserId = typeof data.message.conversation.user === 'object'
          ? data.message.conversation.user._id
          : data.message.conversation.user;
        socket.to(`user:${targetUserId}`).emit('conversation-updated', {
          conversationId: data.conversationId,
        });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
        userId: user.id,
        role: user.role,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.id}`);
    });
  });

  return io;
};
