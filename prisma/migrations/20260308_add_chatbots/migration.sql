-- CreateEnum
CREATE TYPE "ChatbotMessageSender" AS ENUM ('USER', 'BOT');

-- CreateTable
CREATE TABLE "chatbots" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatbots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_user_conversations" (
    "id" TEXT NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatbot_user_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_messages" (
    "id" TEXT NOT NULL,
    "chatbotUserConversationId" TEXT NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "senderId" INTEGER,
    "content" TEXT NOT NULL,
    "senderType" "ChatbotMessageSender" NOT NULL DEFAULT 'USER',
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chatbots_label_key" ON "chatbots"("label");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_user_conversations_chatbotId_userId_key" ON "chatbot_user_conversations"("chatbotId", "userId");

-- CreateIndex
CREATE INDEX "chatbot_messages_chatbotUserConversationId_createdAt_idx" ON "chatbot_messages"("chatbotUserConversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "chatbot_user_conversations" ADD CONSTRAINT "chatbot_user_conversations_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_user_conversations" ADD CONSTRAINT "chatbot_user_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_chatbotUserConversationId_fkey" FOREIGN KEY ("chatbotUserConversationId") REFERENCES "chatbot_user_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON UPDATE CASCADE;
