import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { response } from "@/lib/utils";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return response({
        data: null,
        message: Messages.UN_AUTHORIZED,
        code: StatusCodes.UN_AUTHORIZED
      });
    }

    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) {
      return response({
        data: null,
        message: Messages.REQUIRED,
        code: StatusCodes.BAD_REQUEST
      });
    }

    // Verify conversation belongs to current user
    const conversation = await DB.chatbotUserConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== Number(session.user.id)) {
      return response({
        data: null,
        message: Messages.FORBIDDEN,
        code: StatusCodes.FORBIDDEN
      });
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

    return response({
      data: messages,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error("❌ Error fetching chatbot messages:", error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
