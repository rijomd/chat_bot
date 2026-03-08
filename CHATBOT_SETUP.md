# Chatbot Feature - Quick Setup Guide

## What Was Implemented

A complete chatbot system that mirrors your user chat flow with the following components:

### 📊 Database Changes
- **New Tables**: `chatbots`, `chatbot_user_conversations`, `chatbot_messages`
- **New Enum**: `ChatbotMessageSender` (USER, BOT)
- **Migration File**: `prisma/migrations/20260308_add_chatbots/migration.sql`

### 🔌 API Routes (5 endpoints)
- `GET /api/chatbot/list` - List all available chatbots
- `POST /api/chatbot/create` - Create/get conversation with chatbot
- `GET /api/chatbot/messages` - Fetch chatbot conversation messages
- `POST /api/chatbot/send-message` - Send message to chatbot
- `GET /api/chatbot/user-chats` - Get user's chatbot conversations

### ⚙️ Server Actions
- `chatbotListAction()`
- `chatbotUserChatsAction()`
- `createChatbotConversation(chatbotId)`
- `getChatbotMessages(conversationId)`
- `sendChatbotMessage(conversationId, content)`

### 🎨 UI Components
- **ChatbotList** - Displays available chatbots with selection
- **ChatbotSection** - Message interface for chatbot conversations
- **Tab Navigation** - Switch between User Chats and Chatbots

### 📝 Types
- Complete TypeScript types in `src/types/chatbot.d.ts`

## Step-by-Step Setup

### 1. Apply Database Migration
```bash
# Navigate to project directory
cd c:\MY PROJECTS\Personal\MY-SAMPLE-PROJECTS\ChatBot\chat_ui_user

# Apply migration
npx prisma migrate deploy

# Or if migration doesn't exist yet:
npx prisma migrate dev --name "add_chatbots"
```

### 2. Seed Sample Chatbots
```bash
npx prisma db seed
```

This will create 4 sample chatbots:
- Sports ⚽
- Movies 🎬
- Fashion 👗
- Cooking 🍳

### 3. Regenerate Prisma Client
```bash
npx prisma generate
```

### 4. Restart Development Server
```bash
npm run dev
```

## File Structure

```
src/
├── app/
│   ├── (main)/
│   │   └── page.tsx (UPDATED - now with chatbot support)
│   └── api/
│       └── chatbot/
│           ├── list/route.ts (NEW)
│           ├── create/route.ts (NEW)
│           ├── messages/route.ts (NEW)
│           ├── send-message/route.ts (NEW)
│           └── user-chats/route.ts (NEW)
├── components/
│   └── chat/
│       ├── ChatbotList.tsx (NEW)
│       ├── ChatbotSection.tsx (NEW)
│       └── ... (existing components)
├── actions/
│   └── chatActions.ts (UPDATED - added chatbot actions)
├── types/
│   └── chatbot.d.ts (NEW)
└── constants/
    └── authConstants.ts (unchanged - API routes use same BASE_API_URL)

prisma/
├── schema.prisma (UPDATED - added chatbot models)
├── seed.ts (UPDATED - added chatbot seeding)
└── migrations/
    └── 20260308_add_chatbots/ (NEW - migration SQL)
```

## How It Works

### Data Flow

```
User selects chatbot from ChatbotList
           ↓
handleSelectChatbot() called
           ↓
createChatbotConversation(chatbotId)
           ↓
Conversation created/retrieved from DB
           ↓
getChatbotMessages(conversationId) loads existing messages
           ↓
ChatbotSection displays conversation
           ↓
User types message, clicks send
           ↓
sendChatbotMessage() saves message to DB
           ↓
Messages refreshed and displayed
```

### Routing Logic

```
Main Page (page.tsx)
    ├── User Chats Tab (activeTab === 'users')
    │   ├── MyList component (shows conversations)
    │   └── ChatSection component (shows messages)
    │
    └── Chatbots Tab (activeTab === 'chatbots')
        ├── ChatbotList component (shows available chatbots)
        └── ChatbotSection component (shows chatbot messages)
```

## Key Design Decisions

✅ **Separate Tables**: Chatbot data is completely separate from user conversations
✅ **Unique Constraint**: Only one conversation per user-chatbot pair (automatic deduplication)
✅ **Sender Type**: Using enum to distinguish between USER and BOT messages
✅ **Same API Pattern**: API follows same structure as existing `/api/chat` routes
✅ **Authentication Required**: All endpoints require valid NextAuth session
✅ **Tab Interface**: Clean separation between user chats and chatbots in UI

## Adding Bot Responses

The framework is ready for adding AI bot responses. To implement:

1. **Modify `sendChatbotMessage`** in `/src/app/api/chatbot/send-message/route.ts`:
   ```typescript
   // After saving user message, call your AI service:
   const botResponse = await callAIService(content);
   
   // Save bot response to DB
   await DB.chatbotMessage.create({
     data: {
       chatbotUserConversationId: conversationId,
       chatbotId: conversation.chatbotId,
       content: botResponse,
       senderType: "BOT",
       type: "TEXT",
     }
   });
   ```

2. **Integrate AI Service**:
   - OpenAI API
   - Anthropic Claude
   - Google Gemini
   - Or custom backend service

## Testing the Feature

1. Start the dev server: `npm run dev`
2. Login with test credentials (e.g., test0@gmail.com, password0)
3. Click "Chatbots" tab
4. Select a chatbot (e.g., "Sports")
5. Type a message and click Send
6. Message should appear in the conversation

## Common Issues & Solutions

### Migration Not Found
```bash
# If the migration folder doesn't exist, run:
npx prisma migrate dev --name "add_chatbots"
```

### Prisma Client Out of Date
```bash
npx prisma generate
```

### Database Connection Issues
- Ensure `DB_SUPABASE_URL` is set in `.env.local`
- Check Supabase connection is active

### Page Not Showing Chatbots
- Clear browser cache
- Verify chatbots were seeded: `npx prisma db seed`
- Check browser console for API errors

## next steps

1. ✅ Database schema created
2. ✅ API routes implemented
3. ✅ Server actions implemented
4. ✅ UI components created
5. ⏭️ Run migration and seed database
6. ⏭️ Test the feature in UI
7. ⏭️ (Optional) Integrate AI bot responses
