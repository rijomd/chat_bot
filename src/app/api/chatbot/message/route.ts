import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DB } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const messageId = request.nextUrl.searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "messageId is required" },
        { status: 400 }
      );
    }

    const message = await DB.chatbotMessage.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error fetching chatbot message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
