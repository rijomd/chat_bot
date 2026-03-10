'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSupabaseRealtimeChat } from '@/lib/useSupabaseRealtimeChat';
import { useSupabaseChatbotRealtimeChat } from '@/lib/useSupabaseChatbotRealtimeChat';
import { sendChatbotMessage } from '@/actions/chatActions';
import { ChatMessage, ConversationData } from '@/types/chat';
import { ChatbotMessage } from '@/types/chatbot';

type Props = {
    selectedUser: any | null;
    selectedChatbot: any | null;
    currentUserId: number;
    currentUserName: string;
    isLoading: boolean;
    currentConversation: ConversationData | null;
    messages: ChatMessage[];
    chatbotConversationId?: string | null;
};

export const ChatSection = ({ 
    selectedUser, 
    selectedChatbot,
    currentUserId, 
    currentUserName, 
    isLoading, 
    currentConversation, 
    messages,
    chatbotConversationId,
}: Props) => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useSupabaseRealtimeChat();
    const { chatbotMessages, joinChatbotConversation } = useSupabaseChatbotRealtimeChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    const isUserChat = !!selectedUser && !selectedChatbot;
    const isChatbotChat = !!selectedChatbot && !selectedUser;
    const displayMessages = isChatbotChat ? chatbotMessages : messages;

    // Join chatbot conversation when chatbotConversationId changes
    useEffect(() => {
        if (isChatbotChat && chatbotConversationId) {
            joinChatbotConversation(chatbotConversationId);
        }
    }, [isChatbotChat, chatbotConversationId, joinChatbotConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayMessages]);

    useEffect(() => {
        setMessage("");
    }, [selectedUser, selectedChatbot]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        if (isUserChat && !currentConversation) return;
        if (isChatbotChat && !chatbotConversationId) return;

        setIsSending(true);

        if (isUserChat) {
            const success = await sendMessage(
                currentConversation!.id,
                message,
                currentUserId,
                currentUserName
            );
            if (success) {
                setMessage("");
            }
        } else if (isChatbotChat) {
            const result = await sendChatbotMessage(chatbotConversationId!, message);
            if (result.success) {
                setMessage("");
            }
        }
        setIsSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // No chat selected
    if (!selectedUser && !selectedChatbot) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <h2 className="text-xl text-gray-500 font-semibold">No Preview</h2>
                <p className="text-gray-400 mt-2">Select a user or chatbot to start chatting</p>
            </div>
        );
    }

    // Loading conversation (user chat)
    if (isUserChat && isLoading && !currentConversation) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className="text-gray-400 mt-4">Loading conversation...</p>
            </div>
        );
    }

    // No conversation exists (user chat)
    if (isUserChat && !currentConversation) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <h2 className="text-xl text-gray-500 font-semibold">No Conversation</h2>
                <p className="text-gray-400 mt-2">Start a new conversation with {selectedUser?.participants?.[0]?.name || "this user"}</p>
            </div>
        );
    }

    // Chatbot with no conversation
    if (isChatbotChat && !chatbotConversationId) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <h2 className="text-xl text-gray-500 font-semibold">Loading Chatbot...</h2>
                <p className="text-gray-400 mt-2">Setting up conversation with {selectedChatbot?.label}</p>
            </div>
        );
    }

    const displayName = isUserChat 
        ? selectedUser?.participants?.[0]?.name 
        : selectedChatbot?.label;
    const displayDesc = isUserChat
        ? selectedUser?.participants?.[0]?.email
        : selectedChatbot?.description;

    return (
        <div className="hidden md:flex flex-col w-2/3 bg-gray-50">
            {/* Header */}
            <div className="p-4 bg-white shadow-sm">
                <h2 className="font-semibold text-lg text-black">{displayName}</h2>
                {displayDesc && <p className="text-sm text-gray-600">{displayDesc}</p>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {displayMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Start a conversation with {displayName}</p>
                    </div>
                ) : (
                    displayMessages.map((msg) => {
                        const isOwnMessage = isUserChat 
                            ? (msg as ChatMessage).senderId === currentUserId
                            : (msg as ChatbotMessage).senderType === 'USER';
                        
                        const senderName = isUserChat
                            ? (msg as ChatMessage).senderName
                            : (msg as ChatbotMessage).sender?.name;

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`p-3 rounded-lg shadow max-w-xs ${
                                        isOwnMessage
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white text-gray-900'
                                    }`}
                                >
                                    {senderName && <p className="text-xs font-semibold mb-1 opacity-75">{senderName}</p>}
                                    <p className="break-words">{msg.content}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    value={message}
                    disabled={isSending}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isSending}
                    className="bg-green-500 text-white px-6 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isSending ? 'sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};
