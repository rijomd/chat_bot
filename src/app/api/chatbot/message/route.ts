import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DB } from "@/lib/db";
import { response } from "@/lib/utils";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return response({
        data: null,
        message: Messages.UN_AUTHORIZED,
        code: StatusCodes.UN_AUTHORIZED
      });
    }

    const messageId = request.nextUrl.searchParams.get("messageId");

    if (!messageId) {
      return response({
        data: null,
        message: Messages.REQUIRED,
        code: StatusCodes.BAD_REQUEST
      });
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
      return response({
        data: null,
        message: Messages.NOT_FOUND,
        code: StatusCodes.NOT_FOUND
      });
    }

    return response({
      data: message,
      message: Messages.SUCCESS,
      code: StatusCodes.SUCCESS
    });
  } catch (error) {
    console.error("Error fetching chatbot message:", error);
    return response({
      data: null,
      message: Messages.SERVER_ERROR,
      code: StatusCodes.SERVER_ERROR
    });
  }
}
