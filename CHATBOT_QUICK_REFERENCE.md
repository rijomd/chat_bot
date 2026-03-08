# Chatbot Feature - Quick Reference (Refactored)

## 🎯 How It Works Now

### User Experience
1. **Click the floating AIButton** (green button in bottom-right) 
2. **Select a chatbot** from the dropdown list (Sports, Movies, Fashion, Cooking)
3. **Chatbot conversation loads** in the same ChatSection as user chats
4. **Type and send messages** just like chatting with users

### What Changed
- **Removed**: Separate tab navigation and dedicated chatbot components
- **Added**: Chatbots directly to AIButton (previously showed menu items)
- **Reused**: Existing ChatSection component for both user and chatbot conversations
- **Result**: Simpler, cleaner interface with same functionality

---

## 📍 Component Structure (After Refactor)

```
page.tsx (main)
├─ UserList (unchanged)
├─ MyList (updated)
│  ├─ AIButton (updated) ← Now has chatbots!
│  └─ User conversation list
└─ ChatSection (updated) ← Works for both users and chatbots
```

---

## 🎨 UI Layout

```
┌─────────────────────────────────────────┐
│   UserList (start conversations)        │
├─────────────────┬───────────────────────┤
│  MyList         │   ChatSection         │
│                 │                       │
│  🤖 AIButton    │  - Header             │
│  (Chatbots)     │    (User/Bot name)    │
│                 │                       │
│  User Chats:    │  - Messages           │
│  • User 1       │    (green/white)      │
│  • User 2       │                       │
│  • User 3       │  - Input + Send       │
│                 │                       │
└─────────────────┴───────────────────────┘
```

---

## 🔄 Selection States

### When User Chat Selected
```
selectedUser = { id: "conv-123", ... }
selectedChatbot = null
↓
ChatSection shows:
  - User's name in header
  - User's email as subtitle
  - User conversation messages
```

### When Chatbot Selected
```
selectedChatbot = { id: "chatbot-1", label: "Sports", ... }
selectedUser = null
↓
ChatSection shows:
  - Chatbot name in header
  - Chatbot description as subtitle
  - Chatbot conversation messages
```

### No Selection
```
selectedUser = null
selectedChatbot = null
↓
ChatSection shows "Select a user or chatbot to start chatting"
```

---

## 💬 Message Types

### User Chat Messages
```typescript
{
  id: "msg-1",
  content: "Hello!",
  senderId: 5,
  senderName: "John",
  createdAt: "2026-03-08T10:00:00Z"
}
```
**Display**: Current user's messages right-aligned (green)

### Chatbot Messages
```typescript
{
  id: "msg-2",
  content: "Hi! How can I help?",
  senderType: "USER" | "BOT",
  sender: { id: 5, name: "John" },
  createdAt: "2026-03-08T10:00:00Z"
}
```
**Display**: 
- User messages: Right-aligned (green)
- Bot messages: Left-aligned (white)

---

## 🎮 Key Actions

### Selecting a Chatbot
```typescript
// Click chatbot in AIButton dropdown
↓
handleSelectChatbot(chatbot) {
  setSelectedChatbot(chatbot)
  createChatbotConversation(chatbot.id)
  ├─ Loads/creates conversation
  ├─ Sets chatbotConversationId
  └─ Fetches existing messages
  ↓
  ChatSection renders chatbot view
}
```

### Sending a Chatbot Message
```typescript
// Type message and press Enter or click Send
↓
ChatSection detects it's a chatbot chat
↓
sendChatbotMessage(conversationId, content)
├─ Saves message to database
└─ Returns success
↓
handleChatbotMessageSent()
├─ Fetches updated messages
└─ Updates chatbotMessages state
↓
ChatSection re-renders with new message
```

### Switching Back to Users
```typescript
// Click a user in MyList
↓
handleChatWithUser(user) {
  setSelectedUser(user)
  setSelectedChatbot(null)
  joinConversation(user.id)
  ↓
  ChatSection switches to user chat view
}
```

---

## 📊 Data Flow

```
AIButton
  │
  ├─ Shows: chatbotList (from props)
  │
  └─ On select:
      ↓
      handleSelectChatbot()
      ├─ createChatbotConversation(id)
      │  └─ API: POST /api/chatbot/create
      │
      ├─ getChatbotMessages(conversationId)
      │  └─ API: GET /api/chatbot/messages
      │
      └─ Update states:
         ├─ selectedChatbot
         ├─ chatbotConversationId
         └─ chatbotMessages
         ↓
         ChatSection re-renders
```

---

## 🔌 Props Flow

```
page.tsx
├─ chatbotList → MyList → AIButton
│
├─ selectedChatbot → MyList (highlight AIButton)
│                  → ChatSection (render chatbot view)
│
├─ chatbotConversationId → ChatSection
├─ chatbotMessages → ChatSection
└─ onChatbotMessageSent → ChatSection callback
```

---

## 🛠️ Files Changed

### Modified (4 files)
| File | Change |
|------|--------|
| `AIButton.tsx` | Now accepts chatbots as dynamic prop |
| `ChatSection.tsx` | Handles both users and chatbots |
| `MyList.tsx` | Passes chatbots to AIButton |
| `page.tsx` | Simplified layout, chatbot state mgmt |

### Deleted (2 files)
- `ChatbotList.tsx` ✓
- `ChatbotSection.tsx` ✓

---

## ✅ Setup Checklist

- [x] Database schema created (chatbots, chatbot_user_conversations, chatbot_messages)
- [x] API routes implemented (5 endpoints)
- [x] Server actions created (5 actions)
- [x] UI components integrated
- [x] Component refactoring complete
- [ ] Run migration: `npx prisma migrate deploy`
- [ ] Seed sample chatbots: `npx prisma db seed`
- [ ] Test in browser

---

## 🚀 Testing Steps

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Login** with test credentials
   ```
   Email: test0@gmail.com
   Password: password0
   ```

3. **Click the AIButton** (green floating button)
   - Should show chatbot list

4. **Select a chatbot** (e.g., Sports)
   - Should load chatbot conversation
   - Should show chatbot name and description

5. **Type a message** and send
   - Message should appear on right (green)
   - Message should be saved to database

6. **Click a user** in MyList
   - Should switch to user chat view
   - ChatSection should update

7. **Click AIButton again**
   - Should switch back to chatbot view

---

## 🎯 Key Differences from Original Design

| Aspect | Original | Refactored |
|--------|----------|-----------|
| **Navigation** | Tab buttons | Via MyList items |
| **List View** | Two separate lists | Same list (MyList) |
| **Chat Display** | Two components | One component |
| **Code Lines** | ~600 | ~450 |
| **Components** | 6 | 4 |
| **File Count** | 18 | 16 |

---

## 📝 Notes

- All database tables remain unchanged
- All API routes remain unchanged
- All server actions remain unchanged
- Only UI/component structure was refactored
- No migrations required (schema already updated)

---

## 💡 Future Enhancements

1. **Add bot auto-responses**
   - Integrate AI service (OpenAI, Anthropic, etc.)
   - Auto-save bot responses

2. **Real-time updates**
   - Use Supabase Realtime
   - Live message updates

3. **Search**
   - Search chatbots
   - Search messages

4. **Favorites**
   - Star/favorite chatbots or users
   - Quick access

5. **More chat metadata**
   - Last message preview
   - Unread count
   - Timestamp
