'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSupabaseRealtimeChat } from '@/lib/useSupabaseRealtimeChat';
import { ChatMessage, ConversationData } from '@/types/chat';

type Props = {
    selectedUser: any | null;
    currentUserId: number;
    currentUserName: string;
    isLoading: boolean;
    currentConversation: ConversationData | null;
    messages: ChatMessage[];
};

export const ChatSection = ({ selectedUser, currentUserId, currentUserName, isLoading, currentConversation, messages }: Props) => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useSupabaseRealtimeChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setMessage((prev) => {
            return "";
        });
    }, [selectedUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!selectedUser || !currentConversation || !message.trim()) return;

        setIsSending(true);
        const success = await sendMessage(
            currentConversation.id,
            message,
            currentUserId,
            currentUserName
        );

        if (success) {
            setMessage("");
        }
        setIsSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // No user selected
    if (!selectedUser) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <h2 className="text-xl text-gray-500 font-semibold">No Preview</h2>
                <p className="text-gray-400 mt-2">Select a user to start chatting</p>
            </div>
        );
    }

    // Loading conversation
    if (isLoading && !currentConversation) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className="text-gray-400 mt-4">Loading conversation...</p>
            </div>
        );
    }

    // No conversation exists
    if (!currentConversation) {
        return (
            <div className="hidden md:flex flex-col w-2/3 bg-gray-50 items-center justify-center">
                <h2 className="text-xl text-gray-500 font-semibold">No Conversation</h2>
                <p className="text-gray-400 mt-2">Start a new conversation with {selectedUser?.participants?.[0]?.name || "this user"}</p>
            </div>
        );
    }

    return (
        <div className="hidden md:flex flex-col w-2/3 bg-gray-50">
            {/* Header */}
            <div className="p-4 bg-white shadow-sm">
                <h2 className="font-semibold text-lg text-black">{selectedUser?.participants?.[0]?.name || "Chat with User"}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg: ChatMessage) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`p-3 rounded-lg shadow max-w-xs ${msg.senderId === currentUserId ? 'bg-green-500 text-white' : 'bg-white text-gray-900'}`}>
                                <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                                <p className="break-words">{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

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