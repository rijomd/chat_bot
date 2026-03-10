'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ChatbotMessage } from '@/types/chatbot';

export const useSupabaseChatbotRealtimeChat = () => {
  const [chatbotMessages, setChatbotMessages] = useState<ChatbotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const joinChatbotConversation = useCallback(async (chatbotUserConversationId: string) => {
    try {
      setIsLoading(true);
      console.log('🤖 Joining chatbot conversation:', chatbotUserConversationId);

      // Unsubscribe from previous conversation
      if (channelRef.current) {
        console.log('👋 Unsubscribing from previous chatbot channel');
        await supabase.removeChannel(channelRef.current);
      }

      // Fetch existing chatbot messages using backend API
      console.log('Fetching chatbot messages from backend API...');
      const messagesResponse = await fetch(
        `/api/chatbot/messages?conversationId=${chatbotUserConversationId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        const formattedMessages = messagesData.data || [];
        setChatbotMessages(formattedMessages);
        console.log('✅ Loaded', formattedMessages.length, 'chatbot messages');
      } else {
        console.error('❌ Error fetching chatbot messages:', messagesResponse.status);
        setChatbotMessages([]);
      }

      // Subscribe to real-time changes for chatbot messages
      console.log('🔌 Connecting to Supabase Realtime channel for chatbot...');
      const channel = supabase
        .channel(`chatbot-conversation:${chatbotUserConversationId}`, {
          config: {
            broadcast: { self: true },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chatbot_messages',
            filter: `chatbotUserConversationId=eq.${chatbotUserConversationId}`,
          },
          async (payload: any) => {
            console.log('🔔 New chatbot message received:', payload.new);

            // Fetch full message details via backend API
            const messageResponse = await fetch(
              `/api/chatbot/messages?conversationId=${payload.new.chatbotUserConversationId}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            );

            if (messageResponse.ok) {
              const messageResult = await messageResponse.json();
              const formattedMessage: ChatbotMessage[] = messageResult.data;
              setChatbotMessages(formattedMessage);
            }
          }
        )
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Chatbot Realtime SUBSCRIBED - Ready to receive messages');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Chatbot Realtime CHANNEL_ERROR - Check if Realtime is enabled on chatbot_messages table');
          } else if (status === 'TIMED_OUT') {
            console.error('❌ Chatbot REALTIME TIMED_OUT - WebSocket connection failed (30s timeout)');
          } else {
            console.log('Chatbot Realtime status:', status);
          }
        });

      channelRef.current = channel;
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error joining chatbot conversation:', error);
      setIsLoading(false);
    }
  }, []);

  const leaveChatbotConversation = useCallback(async () => {
    try {
      if (channelRef.current) {
        console.log('👋 Leaving chatbot conversation');
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setChatbotMessages([]);
      }
    } catch (error) {
      console.error('❌ Error leaving chatbot conversation:', error);
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return {
    chatbotMessages,
    isLoading,
    joinChatbotConversation,
    leaveChatbotConversation,
  };
};
