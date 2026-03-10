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

    return response({
      data: chatbotUserChats,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error("❌ Error fetching chatbot user chats:", error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
