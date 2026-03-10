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

    const { conversationId, content } = await request.json();

    if (!conversationId || !content) {
      return response({
        data: null,
        message: Messages.REQUIRED,
        code: StatusCodes.BAD_REQUEST
      });
    }

    const userId = Number(session.user.id);

    // Verify conversation belongs to current user
    const conversation = await DB.chatbotUserConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      return response({
        data: null,
        message: Messages.FORBIDDEN,
        code: StatusCodes.FORBIDDEN
      });
    }

    const chatbot = await DB.chatbot.findUnique({
      where: { id: conversation.chatbotId },
    });

    if (!chatbot) {
      return response({
        data: null,
        message: Messages.NOT_FOUND,
        code: StatusCodes.NOT_FOUND
      });
    }

    // generate ai replay and save message

    const chatbotTopic = chatbot.label;

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

    const chatBotMessage = await DB.chatbotMessage.create({
      data: {
        chatbotUserConversationId: conversationId,
        chatbotId: conversation.chatbotId,
        senderId: userId,
        content: "sample",
        senderType: "BOT",
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

    return response({
      data: chatBotMessage,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error("❌ Error sending chatbot message:", error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
