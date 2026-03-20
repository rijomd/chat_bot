import { DB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { response } from "@/lib/utils";
import { Messages, StatusCodes } from "@/constants/requestsConstants";
import { GoogleGenAI } from "@google/genai";

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

    const ai = new GoogleGenAI({
      apiKey: process.env.AI_API_KEY
    });
    const chatbotTopic = chatbot.label;

    // Enhanced topic-based system instruction with strict restrictions
    const systemInstruction = `
      You are an AI assistant specialized exclusively in ${chatbotTopic}. 

      STRICT TOPIC RESTRICTIONS:
      - You MUST ONLY discuss topics related to ${chatbotTopic}
      - If the user asks about anything outside ${chatbotTopic}, you MUST politely decline and redirect
      - Examples of acceptable topics: [specific to ${chatbotTopic}]
      - Examples of prohibited topics: general knowledge, other subjects, personal advice (unless related to ${chatbotTopic})

      RESPONSE GUIDELINES:
      - Always check if the user's question relates to ${chatbotTopic} before answering
      - If off-topic, respond: "I'm specifically designed to discuss ${chatbotTopic}. Could you ask me something related to that topic instead?"
      - Be helpful, concise, and focused on ${chatbotTopic}
      - If unsure about relevance, err on the side of staying on-topic

      CURRENT CONTEXT: You are chatting about ${chatbotTopic}. Maintain this focus throughout the conversation.
        `;

    const chatHistory = await DB.chatbotMessage.findMany({
      where: { chatbotUserConversationId: conversationId },
      orderBy: { createdAt: 'asc' }
    });

    // Format chat history for Google AI API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.senderType === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Create a chat session with history
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
      history: formattedHistory,
    });

    const aiResponse = await chat.sendMessage({
      message: content,
    });

    const aiReply = aiResponse.text || "Sorry, I couldn't generate a response."

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
        content: aiReply,
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
