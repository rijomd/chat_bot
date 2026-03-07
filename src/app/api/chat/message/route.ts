import { NextRequest } from 'next/server';
import { DB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { response } from '@/lib/utils';
import { Messages, StatusCodes } from '@/constants/requestsConstants';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return response({
        data: null,
        message: Messages.UN_AUTHORIZED,
        code: StatusCodes.UN_AUTHORIZED
      });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return response({
        data: null,
        message: Messages.REQUIRED,
        code: StatusCodes.BAD_REQUEST
      });
    }

    // Fetch message with sender information
    const message = await DB.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (!message) {
      return response({
        data: null,
        message: Messages.NOT_FOUND,
        code: StatusCodes.NOT_FOUND
      });
    }

    // Verify user is part of the conversation
    const isParticipant = message.conversation.participants.some((p) => p.userId === Number(session.user.id));

    if (!isParticipant) {
      return response({
        data: null,
        message: Messages.FORBIDDEN,
        code: StatusCodes.FORBIDDEN
      });
    }

    // Format message
    const formattedMessage = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.sender.name || 'Unknown',
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      type: message.type,
      status: message.status,
    };

    return response({
      data: formattedMessage,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });

  } catch (error) {
    console.error('Error fetching message:', error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
