// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { socket } from './socket';

// export interface ChatMessage {
//   id: string;
//   conversationId: string;
//   senderId: number;
//   senderName: string;
//   content: string;
//   createdAt: string;
//   type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
//   status: 'SENT' | 'DELIVERED' | 'READ';
// }

// export interface ConversationData {
//   id: string;
//   messages: ChatMessage[];
//   participants: Array<{ id: number; name: string; email: string }>;
// }

// export const useSocket = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [currentConversation, setCurrentConversation] = useState<ConversationData | null>(null);

//   useEffect(() => {
//     // Handle connection
//     const onConnect = () => {
//       console.log('✅ Socket connected');
//       setIsConnected(true);
//     };

//     const onDisconnect = () => {
//       console.log('❌ Socket disconnected');
//       setIsConnected(false);
//     };

//     // Handle incoming messages
//     const onReceiveMessage = (message: ChatMessage) => {
//       console.log('📨 Message received:', message);
//       setMessages((prev) => [...prev, message]);
//     };

//     // Handle conversation load
//     const onConversationLoaded = (conversation: ConversationData) => {
//       console.log('💬 Conversation loaded:', conversation);
//       setCurrentConversation(conversation);
//       setMessages(conversation.messages || []);
//     };

//     // Handle error
//     const onError = (error: string) => {
//       console.error('⚠️ Socket error:', error);
//     };

//     socket.on('connect', onConnect);
//     socket.on('disconnect', onDisconnect);
//     socket.on('message:received', onReceiveMessage);
//     socket.on('conversation:loaded', onConversationLoaded);
//     socket.on('error', onError);

//     return () => {
//       socket.off('connect', onConnect);
//       socket.off('disconnect', onDisconnect);
//       socket.off('message:received', onReceiveMessage);
//       socket.off('conversation:loaded', onConversationLoaded);
//       socket.off('error', onError);
//     };
//   }, []);

//   const joinConversation = useCallback((conversationId: string) => {
//     console.log('🔗 Joining conversation:', conversationId);
//     setMessages([]);
//     socket.emit('conversation:join', { conversationId }, (data: ConversationData) => {
//       setCurrentConversation(data);
//       setMessages(data.messages || []);
//     });
//   }, []);

//   const sendMessage = useCallback(
//     (conversationId: string, content: string) => {
//       if (!content.trim()) return;

//       const message = {
//         conversationId,
//         content,
//         type: 'TEXT',
//       };

//       socket.emit('message:send', message, (response: { success: boolean; message?: ChatMessage; error?: string }) => {
//         if (response.success && response.message) {
//           setMessages((prev) => [...prev, response.message!]);
//         } else {
//           console.error('❌ Failed to send message:', response.error);
//         }
//       });
//     },
//     []
//   );

//   const leaveConversation = useCallback((conversationId: string) => {
//     console.log('👋 Leaving conversation:', conversationId);
//     socket.emit('conversation:leave', { conversationId });
//     setMessages([]);
//     setCurrentConversation(null);
//   }, []);

//   return {
//     messages,
//     isConnected,
//     currentConversation,
//     joinConversation,
//     sendMessage,
//     leaveConversation,
//   };
// };
