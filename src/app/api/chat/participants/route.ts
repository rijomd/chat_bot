import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json(
                { error: 'conversationId is required' },
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

        // Fetch all participants in the conversation
        const participants = await DB.conversationParticipant.findMany({
            where: {
                conversationId,
            },
            include: {
                user: true,
            },
        });

        // Format participants
        const formattedParticipants = participants
            .map((p) => ({
                id: p.user.id,
                name: p.user.name || 'Unknown',
                email: p.user.email,
            }))
            .filter((p) => p.id !== Number(session.user.id)); // Exclude current user

        return NextResponse.json({
            success: true,
            data: formattedParticipants,
        });
    } catch (error) {
        console.error('Error fetching participants:', error);
        return NextResponse.json(
            { error: 'Failed to fetch participants' },
            { status: 500 }
        );
    }
}
