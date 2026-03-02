'use client';

import React, { useState } from 'react';

import { User } from '@prisma/client'
import { createNewChat } from '@/actions/chatActions';

type Props = {
    userList: User[]
    onConversationCreated?: () => void;
}

const placeholderImages = [
    '/user2.png',
    '/user.png',
    '/user3.jpg',
    '/user4.png',
];

export const UserList = ({ userList, onConversationCreated }: Props) => {
    const [loading, setLoading] = useState<number | null>(null);

    const handleCreateConversation = async (userId: number) => {
        try {
            setLoading(userId);
            const response = await createNewChat(userId);

            if (response.success) {
                onConversationCreated?.();
            } else {
                console.error('Failed to create conversation');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="w-full bg-white shadow-sm p-3 overflow-x-auto overflow-y-hidden no-scrollbar flex-shrink-0">
            <div className="flex gap-4 min-w-max">
                {userList?.length > 0 && userList.map((item) => (
                    <div key={item.id} className=" w-[140px]  flex flex-col items-center py-3 px-4" style={{ boxShadow: '0px 1px 8px 1px #c3e5c3' }}>
                        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-emerald-400 shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center ring-2 ring-white">
                                <img
                                    src={placeholderImages[item.id % placeholderImages.length]}
                                    alt={`${item.name}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs mt-2 text-gray-700">{item.name}</span>
                        <button
                            onClick={() => handleCreateConversation(item.id)}
                            disabled={loading === item.id}
                            className="mt-2 text-white h-[24px] w-full cursor-pointer p-1 bg-green-600 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading === item.id ? '...' : '+'}
                        </button>
                    </div>
                ))}
                {userList?.length === 0 && (
                    <div className="w-full text-center py-10 text-gray-500">
                        No users available to chat with.
                    </div>
                )}
            </div>
        </div>
    )
}