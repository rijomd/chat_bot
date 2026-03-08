import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Verify conversation belongs to current user
    const conversation = await DB.chatbotUserConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const messages = await DB.chatbotMessage.findMany({
      where: {
        chatbotUserConversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("❌ Error fetching chatbot messages:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching messages" },
      { status: 500 }
    );
  }
}
