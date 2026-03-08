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

    const chatBots = await DB.chatbot.findMany({
      select: {
        id: true,
        label: true,
        description: true,
        icon: true,
        color: true,
        backgroundColor: true,
        textColor: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: chatBots,
    });
  } catch (error) {
    console.error("❌ Error fetching chatBots:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching chatBots" },
      { status: 500 }
    );
  }
}
