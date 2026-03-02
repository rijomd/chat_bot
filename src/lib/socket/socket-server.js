// /**
//  * Socket.IO Server Handler
//  * 
//  * This file should be run as a separate Node.js server.
//  * In development, you can start it alongside the Next.js dev server.
//  * 
//  * Usage:
//  * node socket-server.js
//  * 
//  * Or add to package.json scripts: "socket": "node socket-server.js"
//  */

// const { Server } = require('socket.io');
// const http = require('http');
// const cors = require('cors');
// const express = require('express');

// const app = express();
// const server = http.createServer(app);

// // Setup CORS for Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
//   transports: ['websocket', 'polling'],
// });

// // In-memory storage for demo (replace with database in production)
// const conversations = new Map();
// const userSockets = new Map();

// // Mock database data - replace with actual DB calls
// const mockMessages = {
//   'conv-1': [
//     {
//       id: 'msg-1',
//       conversationId: 'conv-1',
//       senderId: 1,
//       senderName: 'John Doe',
//       content: 'Hello! How are you?',
//       createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
//       type: 'TEXT',
//       status: 'DELIVERED',
//     },
//     {
//       id: 'msg-2',
//       conversationId: 'conv-1',
//       senderId: 2,
//       senderName: 'Jane Smith',
//       content: "I'm doing great! How about you?",
//       createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
//       type: 'TEXT',
//       status: 'DELIVERED',
//     },
//   ],
//   'conv-2': [],
//   'conv-3': [],
// };

// io.on('connection', (socket) => {
//   console.log(`✅ User connected: ${socket.id}`);

//   // Store user socket mapping
//   const userId = socket.handshake.query.userId || socket.id;
//   userSockets.set(userId, socket.id);

//   // Handle joining a conversation
//   socket.on('conversation:join', (data, callback) => {
//     const { conversationId } = data;
//     console.log(`🔗 User ${userId} joining conversation ${conversationId}`);

//     // Join Socket.IO room
//     socket.join(`conversation:${conversationId}`);

//     // Get messages from mock database
//     const messages = mockMessages[conversationId] || [];

//     // Mock conversation data
//     const conversation = {
//       id: conversationId,
//       messages: messages,
//       participants: [
//         { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
//         { id: 1, name: 'John Doe', email: 'john@example.com' },
//       ],
//     };

//     // Callback to send conversation data back
//     if (callback && typeof callback === 'function') {
//       callback(conversation);
//     }

//     // Notify others in the conversation
//     socket.to(`conversation:${conversationId}`).emit('user:joined', {
//       userId,
//       conversationId,
//     });
//   });

//   // Handle leaving a conversation
//   socket.on('conversation:leave', (data) => {
//     const { conversationId } = data;
//     console.log(`👋 User ${userId} leaving conversation ${conversationId}`);

//     socket.leave(`conversation:${conversationId}`);

//     // Notify others
//     socket.to(`conversation:${conversationId}`).emit('user:left', {
//       userId,
//       conversationId,
//     });
//   });

//   // Handle sending messages
//   socket.on('message:send', (data, callback) => {
//     const { conversationId, content, type } = data;
//     console.log(`📨 Message from ${userId} in ${conversationId}:`, content);

//     if (!content.trim()) {
//       if (callback) callback({ success: false, error: 'Message cannot be empty' });
//       return;
//     }

//     // Create message object
//     const message = {
//       id: `msg-${Date.now()}`,
//       conversationId,
//       senderId: userId,
//       senderName: `User ${userId}`,
//       content,
//       type: type || 'TEXT',
//       status: 'SENT',
//       createdAt: new Date().toISOString(),
//     };

//     // Store message (in production, save to database)
//     if (!mockMessages[conversationId]) {
//       mockMessages[conversationId] = [];
//     }
//     mockMessages[conversationId].push(message);

//     // Emit to all users in the conversation
//     io.to(`conversation:${conversationId}`).emit('message:received', message);

//     // Callback confirmation
//     if (callback && typeof callback === 'function') {
//       callback({ success: true, message });
//     }
//   });

//   // Handle typing indicator
//   socket.on('user:typing', (data) => {
//     const { conversationId, isTyping } = data;
//     socket.to(`conversation:${conversationId}`).emit('user:typing', {
//       userId,
//       isTyping,
//     });
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log(`❌ User disconnected: ${socket.id}`);
//     userSockets.delete(userId);

//     // Notify all rooms user was in
//     io.emit('user:offline', { userId });
//   });

//   // Handle errors
//   socket.on('error', (error) => {
//     console.error(`⚠️ Socket error for ${socket.id}:`, error);
//   });
// });

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ status: 'Socket.IO Server is running' });
// });

// const PORT = process.env.SOCKET_PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`🚀 Socket.IO server running on port ${PORT}`);
//   console.log(`📡 Connected clients: ${io.engine.clientsCount}`);
// });

// // Log connected clients periodically
// setInterval(() => {
//   console.log(`📊 Active connections: ${io.engine.clientsCount}`);
// }, 30000);

// module.exports = { io, server };


// env
// NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
// SOCKET_PORT=3001
