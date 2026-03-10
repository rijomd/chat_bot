import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { response } from "@/lib/utils";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return response({
        data: null,
        message: Messages.UN_AUTHORIZED,
        code: StatusCodes.UN_AUTHORIZED
      });
    }

    const { chatbotId } = await request.json();

    if (!chatbotId) {
      return response({
        data: null,
        message: Messages.REQUIRED,
        code: StatusCodes.BAD_REQUEST
      });
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

    return response({
      data: chatbotUserConversation,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error("❌ Error creating chatbot conversation:", error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
