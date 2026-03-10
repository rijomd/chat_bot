import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { response } from "@/lib/utils";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return response({
        data: null,
        message: Messages.UN_AUTHORIZED,
        code: StatusCodes.UN_AUTHORIZED
      });
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

    return response({
      data: chatBots,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error("❌ Error fetching chatBots:", error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
