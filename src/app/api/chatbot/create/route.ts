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

    const { chatbotId } = await request.json();

    if (!chatbotId) {
      return NextResponse.json(
        { success: false, message: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    // Check if conversation already exists
    let chatbotUserConversation = await DB.chatbotUserConversation.findUnique({
      where: {
        chatbotId_userId: {
          chatbotId,
          userId,
        },
      },
      include: {
        chatbot: true,
      },
    });

    // If conversation doesn't exist, create it
    if (!chatbotUserConversation) {
      chatbotUserConversation = await DB.chatbotUserConversation.create({
        data: {
          chatbotId,
          userId,
        },
        include: {
          chatbot: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: chatbotUserConversation,
    });
  } catch (error) {
    console.error("❌ Error creating chatbot conversation:", error);
    return NextResponse.json(
      { success: false, message: "Error creating chatbot conversation" },
      { status: 500 }
    );
  }
}
