import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { DB } from '@/lib/db';
import { response } from '@/lib/utils';
import { Messages, StatusCodes } from '@/constants/requestsConstants';

export async function GET(req: NextRequest) {
    try {
        // Get authenticated session
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return response({
                data: null,
                message: Messages.UN_AUTHORIZED,
                code: StatusCodes.UN_AUTHORIZED
            });
        }

        const userId = session.user?.id;

        const conversations = await DB.conversation.findMany({
            where: { participants: { some: { userId: Number(userId) } } },

            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        sender: {
                            select: { name: true, id: true },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Format the response
        const chatList = conversations.map((conversation) => {
            const otherParticipants = conversation.participants.filter(
                (p) => p.userId !== Number(userId)
            );

            const latestMessage = conversation.messages[0];

            return {
                id: conversation.id,
                participants: otherParticipants.map((p) => ({
                    id: p.user.id,
                    name: p.user.name,
                    email: p.user.email,
                })),
                lastMessage: latestMessage
                    ? {
                        content: latestMessage.content,
                        senderName: latestMessage.sender.name,
                        createdAt: latestMessage.createdAt,
                    }
                    : null,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
            };
        });

        return response({
            data: chatList,
            message: Messages.SUCCESS,
            code: StatusCodes.SUCCESS
        });

    } catch (error) {
        console.error('Error fetching chat list:', error);
        return response({ data: null, message: Messages.SERVER_ERROR, code: 500 });
    }
}
