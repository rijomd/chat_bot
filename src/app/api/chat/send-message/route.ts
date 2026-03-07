import { NextRequest } from 'next/server';
import { DB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { response } from '@/lib/utils';
import { Messages, StatusCodes } from '@/constants/requestsConstants';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return response({
        data: null,
        message: Messages.UN_AUTHORIZED,
        code: StatusCodes.UN_AUTHORIZED
      });
    }

    const body = await request.json();
    const { conversationId, content, type = 'TEXT' } = body;

    if (!conversationId || !content) {
      return response({
        data: null,
        message: 'conversationId and content are required',
        code: StatusCodes.BAD_REQUEST
      });
    }

    // Verify user is part of this conversation
    const isParticipant = await DB.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: Number(session.user.id),
      },
    });

    if (!isParticipant) {
      return response({
        data: null,
        message: Messages.FORBIDDEN,
        code: StatusCodes.FORBIDDEN
      });
    }

    // Create message
    const message = await DB.message.create({
      data: {
        conversationId,
        senderId: Number(session.user.id),
        content,
        type: type as any,
        status: 'SENT',
      },
      include: {
        sender: true,
      },
    });

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
    console.error('Error sending message:', error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
