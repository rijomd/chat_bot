# Chatbot Feature Implementation Guide

## Overview

This implementation adds a complete chatbot feature to your Next.js + Prisma chat application. The chatbot system mirrors your existing user chat flow while maintaining a separate data structure for chatbot conversations.

## Database Schema

### New Tables Added:

#### 1. **chatbots**
Stores chatbot configuration and metadata.
- `id`: Unique identifier (CUID)
- `label`: Chatbot name (unique)
- `description`: Chatbot description
- `icon`: Emoji or icon representation
- `backgroundColor`: CSS class for background color
- `textColor`: CSS class for text color

#### 2. **chatbot_user_conversations**
Tracks conversations between users and specific chatbots.
- `id`: Unique identifier
- `chatbotId`: Reference to chatbot
- `userId`: Reference to user
- `createdAt`: Conversation creation timestamp
- `updatedAt`: Last update timestamp
- Unique constraint: `(chatbotId, userId)` - one conversation per user-chatbot pair

#### 3. **chatbot_messages**
Stores individual messages in chatbot conversations.
- `id`: Unique message ID
- `chatbotUserConversationId`: Reference to conversation
- `chatbotId`: Reference to chatbot
- `senderId`: User ID (nullable, for bot messages)
- `content`: Message content
- `senderType`: Either 'USER' or 'BOT'
- `type`: Message type (TEXT, IMAGE, FILE, AUDIO, VIDEO)
- `status`: Message status (SENT, DELIVERED, READ)
- `createdAt`: Message timestamp

## Running the Migration

```bash
# Apply the chatbot schema changes
npx prisma migrate deploy

# Or use migrate dev if you want to generate new migration
npx prisma migrate dev --name "add_chatbots"

# Seed sample chatbots
npx prisma db seed
```

## API Routes

### 1. **GET /api/chatbot/list**
Retrieves all available chatbots.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "chatbot-id",
      "label": "Sports",
      "description": "Sports related news and updates",
      "icon": "⚽",
      "backgroundColor": "bg-emerald-50",
      "textColor": "text-emerald-700"
    }
  ]
}
```

### 2. **POST /api/chatbot/create**
Creates or retrieves a conversation between current user and a chatbot.

**Request:**
```json
{
  "chatbotId": "chatbot-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "conversation-id",
    "chatbotId": "chatbot-id",
    "userId": 1,
    "chatbot": { ... }
  }
}
```

### 3. **GET /api/chatbot/messages**
Fetches all messages in a chatbot conversation.

**Query Parameters:**
- `conversationId`: The conversation ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "message-id",
      "content": "Hello!",
      "senderType": "USER",
      "sender": { "id": 1, "name": "User", "email": "user@example.com" },
      "createdAt": "2026-03-08T10:00:00Z"
    }
  ]
}
```

### 4. **POST /api/chatbot/send-message**
Sends a message in a chatbot conversation.

**Request:**
```json
{
  "conversationId": "conversation-id",
  "content": "What's your advice?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "message-id",
    "content": "What's your advice?",
    "senderType": "USER",
    "senderId": 1
  }
}
```

### 5. **GET /api/chatbot/user-chats**
Retrieves all chatbot conversations for the current user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conversation-id",
      "chatbotId": "chatbot-id",
      "userId": 1,
      "chatbot": { "label": "Sports", ... }
    }
  ]
}
```

## Server Actions

Located in `src/actions/chatActions.ts`:

### Available Actions:

```typescript
// Fetch all available chatbots
chatbotListAction(): Promise<Chatbot[]>

// Get all chatbot conversations for current user
chatbotUserChatsAction(): Promise<ChatbotUserConversation[]>

// Create/get conversation with a chatbot
createChatbotConversation(chatbotId: string): Promise<ChatbotUserConversation>

// Get messages from a chatbot conversation
getChatbotMessages(conversationId: string): Promise<ChatbotMessage[]>

// Send a message to a chatbot
sendChatbotMessage(conversationId: string, content: string): Promise<ChatbotMessage>
```

## Components

### 1. **ChatbotList** (`src/components/chat/ChatbotList.tsx`)
Displays available chatbots in a scrollable list.
- Shows chatbot icon, label, and description
- Indicates selected chatbot with blue highlight
- Handles chatbot selection

**Props:**
```typescript
{
  chatbotList: any[];
  handleSelectChatbot: (chatbot: any) => void;
  selectedChatbot: any | null;
}
```

### 2. **ChatbotSection** (`src/components/chat/ChatbotSection.tsx`)
Displays chatbot conversation and message interface.
- Shows conversation header with chatbot info
- Displays message thread
- Provides message input and send functionality
- Auto-scrolls to latest message
- Shows loading and empty states

**Props:**
```typescript
{
  selectedChatbot: any | null;
  currentUserId: number;
  currentUserName: string;
  conversationId: string | null;
  messages: ChatbotMessage[];
  onMessageSent: () => void;
}
```

## Main Page Updates

The home page (`src/app/(main)/page.tsx`) now includes:

1. **Tab Navigation**: Switch between "User Chats" and "Chatbots"
2. **Dynamic Layout**: 
   - User Chats view: MyList + ChatSection
   - Chatbots view: ChatbotList + ChatbotSection
3. **State Management**: Separate state for user chats and chatbot conversations
4. **Data Loading**: Loads both user lists and chatbot lists on mount

## Database Relationships

```
Chatbot (1) ─────── (M) ChatbotUserConversation
           └─────── (M) ChatbotMessage

User (1) ─────── (M) ChatbotUserConversation
                 └─── (M) ChatbotMessage

ChatbotUserConversation (1) ─────── (M) ChatbotMessage
```

## Sample Chatbots (Pre-seeded)

1. **Sports** ⚽
   - "Sports related news and updates"
   
2. **Movies** 🎬
   - "Find anything about movies"
   
3. **Fashion** 👗
   - "Get the latest fashion trends"
   
4. **Cooking** 🍳
   - "Get smart cooking tips and recipes"

## Key Features

✅ **Separate Chatbot Table**: Chatbots metadata stored independently from users
✅ **User-Chatbot Conversations**: Each user has separate conversations with each chatbot
✅ **Message Threading**: All messages stored with sender type (USER/BOT)
✅ **Consistent API**: Mirrors existing user chat API pattern
✅ **Tab Navigation**: Easy switching between user chats and chatbots
✅ **Type Safety**: Full TypeScript support with chatbot types
✅ **Authentication**: Requires NextAuth session for all operations
✅ **Authorization**: Users can only access their own conversations

## Future Enhancements

1. **Bot Responses**: Implement AI bot responses (integrate with OpenAI, Anthropic, etc.)
2. **Real-time Updates**: Use Supabase Realtime for live message updates
3. **Chatbot Management**: Admin panel to create/edit chatbots
4. **Message Attachments**: Support for images, files in chatbot conversations
5. **Conversation History**: Archive/restore old conversations
6. **Analytics**: Track chatbot usage and user engagement
7. **Custom Chatbots**: Allow users to create and train custom chatbots

## Error Handling

All API routes include:
- Authentication checks (401 Unauthorized)
- Authorization checks (403 Forbidden)
- Proper error responses with meaningful messages
- Error logging for debugging

## Notes

- Chatbot labels are unique to prevent duplicates
- Auto-creates conversation on first message
- Message ordering by `createdAt` ascending (chronological)
- All timestamps in UTC/ISO format
- Messages indexed on `(chatbotUserConversationId, createdAt)` for performance
