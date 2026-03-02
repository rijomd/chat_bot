import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { conversationId, content, type = 'TEXT' } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'conversationId and content are required' },
        { status: 400 }
      );
    }

    // Verify user is part of this conversation
    const isParticipant = await DB.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: Number(session.user.id),
      },
    });

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Not a participant in this conversation' },
        { status: 403 }
      );
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

    return NextResponse.json({
      success: true,
      data: formattedMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
