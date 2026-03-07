import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DB } from '@/lib/db';
import { response } from '@/lib/utils';
import { Messages, StatusCodes } from '@/constants/requestsConstants';

export async function POST(req: NextRequest) {
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

        const { userId } = await req.json();

        if (!userId) {
            return response({
                data: null,
                message: "User ID is required",
                code: StatusCodes.BAD_REQUEST
            });
        }

        const currentUserId = session.user.id;

        // Check if conversation already exists between these two users
        const existingConversation = await DB.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        userId: {
                            in: [currentUserId, userId],
                        },
                    },
                },
            },
            include: {
                participants: true,
            },
        });

        if (existingConversation && existingConversation.participants.length === 2) {
             return response({
                data: existingConversation,
                message: "Conversation already exists",
                code: StatusCodes.CONFLICT
            });
        }

        // Create new conversation with both participants
        const newConversation = await DB.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: currentUserId },
                        { userId: userId },
                    ],
                },
            },
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
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });

        return response({
            data: newConversation,
            message: Messages.SUCCESS,
            code: StatusCodes.SUCCESS
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return response({ data: null, message: Messages.SERVER_ERROR, code: 500 });
    }
}
