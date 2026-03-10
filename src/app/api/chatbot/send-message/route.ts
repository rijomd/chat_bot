import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { conversationId, content } = await request.json();

    if (!conversationId || !content) {
      return NextResponse.json(
        { success: false, message: "Conversation ID and content are required" },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    // Verify conversation belongs to current user
    const conversation = await DB.chatbotUserConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // generate ai replay and save message

    // Save user message
    const message = await DB.chatbotMessage.create({
      data: {
        chatbotUserConversationId: conversationId,
        chatbotId: conversation.chatbotId,
        senderId: userId,
        content,
        senderType: "USER",
        type: "TEXT",
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
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("❌ Error sending chatbot message:", error);
    return NextResponse.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}
