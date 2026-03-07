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
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return response({
        data: null,
        message: 'conversationId is required',
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

    // Fetch messages with sender information
    const messages = await DB.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format messages
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderName: msg.sender.name || 'Unknown',
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
      type: msg.type,
      status: msg.status,
    }));

    return response({
      data: formattedMessages,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
