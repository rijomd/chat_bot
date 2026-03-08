import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    const chatbotUserChats = await DB.chatbotUserConversation.findMany({
      where: { userId },
      include: {
        chatbot: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: chatbotUserChats,
    });
  } catch (error) {
    console.error("❌ Error fetching chatbot user chats:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching chatbot chats" },
      { status: 500 }
    );
  }
}
