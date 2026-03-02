'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ChatMessage, ConversationData } from '@/types/chat';


export const useSupabaseRealtimeChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const joinConversation = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      console.log('🔗 Joining conversation:', conversationId);
      let formattedMessages: ChatMessage[] = [];

      // Unsubscribe from previous conversation
      if (channelRef.current) {
        console.log('👋 Unsubscribing from previous channel');
        await supabase.removeChannel(channelRef.current);
      }

      // Fetch existing messages using backend API (much faster than REST API)
      console.log('Fetching messages from backend API...');
      const messagesResponse = await fetch(
        `/api/chat/messages?conversationId=${conversationId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        formattedMessages = messagesData.data || [];
        setMessages(formattedMessages);
      } else {
        console.error('❌ Error fetching messages:', messagesResponse.status);
        setMessages([]);
      }

      // Fetch conversation participants using backend API
      console.log('Fetching participants from backend API...');
      const participantsResponse = await fetch(
        `/api/chat/participants?conversationId=${conversationId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      let participants = [];
      if (participantsResponse.ok) {
        const participantsData = await participantsResponse.json();
        participants = participantsData.data || [];
      } else {
        console.error('❌ Error fetching participants:', participantsResponse.status);
      }

      setCurrentConversation({
        id: conversationId,
        messages: formattedMessages,
        participants: participants || [],
      });

      // Subscribe to real-time changes with better error handling
      console.log(' Connecting to Supabase Realtime channel...');
      const channel = supabase
        .channel(`conversation:${conversationId}`, {
          config: {
            broadcast: { self: true },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversationId=eq.${conversationId}`,
          },
          async (payload: any) => {
            console.log('New message received:', payload.new);
            // Fetch full message details including sender name via backend API
            const messageResponse = await fetch(
              `/api/chat/message?messageId=${payload.new.id}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            );

            if (messageResponse.ok) {
              const messageResult = await messageResponse.json();
              const formattedMessage: ChatMessage = messageResult.data;
              setMessages((prev) => {
                if (prev.some((m) => m.id === formattedMessage.id)) {
                  return prev;
                }
                return [...prev, formattedMessage];
              });
            }
          }
        )
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime SUBSCRIBED - Ready to receive messages');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Realtime CHANNEL_ERROR - Check if Realtime is enabled on messages table');
          } else if (status === 'TIMED_OUT') {
            console.error('❌ REALTIME TIMED_OUT - WebSocket connection failed (30s timeout)');
          } else {
            console.log('Realtime status:', status);
          }
        });

      channelRef.current = channel;
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error joining conversation:', error);
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, content: string, senderId: number, senderName: string) => {
      if (!content.trim()) {
        console.warn('⚠️ Message cannot be empty');
        return false;
      }

      try {
        const response = await fetch('/api/chat/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            content,
            type: 'TEXT',
          }),
        });

        if (!response.ok) {
          console.error('❌ Error sending message');
          return false;
        }

        const result = await response.json();
        console.log('✅ Message sent:', result.data);
        return true;
      } catch (error) {
        console.error('❌ Error in sendMessage:', error);
        return false;
      }
    },
    []
  );

  const leaveConversation = useCallback(async () => {
    console.log('👋 Leaving conversation');
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setMessages([]);
    setCurrentConversation(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return {
    messages,
    currentConversation,
    isLoading,
    joinConversation,
    sendMessage,
    leaveConversation,
  };
};
