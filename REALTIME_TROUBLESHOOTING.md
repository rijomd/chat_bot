# 🔧 Supabase Realtime TIMED_OUT - Troubleshooting Guide

## ❌ Error: "Realtime status: TIMED_OUT"

This means the Supabase Realtime connection failed to establish. Here's how to fix it:

## ✅ Step 1: Verify Environment Variables

### Check your `.env.local` file exists and has values:

```bash
# .env.local should contain:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### If not set:
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Verify in browser console:
```javascript
// Open browser DevTools (F12) → Console
console.log('Checking Supabase:')
// You should see:
// 🔌 Supabase Realtime Configuration:
//   - URL: your-project.supabase.co
//   - Key: eyJhbGciOi...
```

If you see "Not set", the `.env.local` file is missing values.

---

## ✅ Step 2: Enable Realtime on Messages Table

**This is the most common issue!**

### In Supabase Dashboard:

1. Go to **Database** → **Replication**
2. Click on `public` schema
3. Find the **messages** table
4. Toggle the switch to **ON** (should be green/enabled)
5. Click **Save**

```
Replication
├── public
│   ├── conversation_participants (status)
│   ├── conversations (should be OFF)
│   ├── messages ✅ MUST BE ON ← Enable this
│   └── users (should be OFF)
```

**If Realtime is OFF on messages:**
- Messages won't update in real-time
- You'll see: "TIMED_OUT" error
- Chat will still work via backend API (non-realtime)

**To enable:**
1. Click the toggle next to `messages`
2. Wait for it to turn green (5-10 seconds)
3. You should see "Replication enabled successfully"

---

## ✅ Step 3: Check Supabase Project URL

Your URL should look like:
```
https://xxxxxxxxxxxx.supabase.co
```

NOT:
- ❌ `http://` (should be `https://`)
- ❌ `localhost` (should be your supabase domain)
- ❌ With `/rest/v1` at the end (should just be the base URL)

---

## ✅ Step 4: Restart Development Server

After making changes to `.env.local` or Supabase settings:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

The environment variables are only loaded when the server starts.

---

## 🔍 Step 5: Browser Console Diagnostics

Open **DevTools (F12) → Console** and look for:

### ✅ Correct Setup:
```
🔌 Supabase Realtime Configuration:
  - URL: your-project.supabase.co
  - Key: eyJhbGciOi...
🔗 Joining conversation: conv-123
📥 Fetching messages from backend API...
✅ Loaded 5 messages
👥 Fetching participants from backend API...
✅ Loaded 1 participants
🔌 Connecting to Supabase Realtime channel...
✅ Realtime SUBSCRIBED - Ready to receive messages
```

### ❌ Environment Variables Missing:
```
❌ Missing Supabase credentials!
  - NEXT_PUBLIC_SUPABASE_URL: ❌ Missing
  - NEXT_PUBLIC_SUPABASE_ANON_KEY: ❌ Missing
Please check your .env.local file
```

### ❌ Realtime Disabled:
```
❌ Realtime TIMED_OUT - Connection failed. Possible causes:
   1. Realtime not enabled on messages table in Supabase
   2. Invalid NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY
   3. Network connectivity issue
   4. Supabase project URL might be incorrect
⚠️ Chat will still work with backend API, but live updates unavailable
```

---

## 🎯 Quick Checklist

- [ ] `.env.local` file exists with correct values
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set (https://...supabase.co)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Realtime is **ENABLED** on `messages` table in Supabase
- [ ] Development server restarted after `.env.local` changes
- [ ] Browser console shows no "Missing Supabase credentials" error
- [ ] Browser console shows "✅ Realtime SUBSCRIBED"

---

## ❓ Common Issues & Solutions

### **Issue 1: `.env.local` not found**
```bash
# Check if file exists:
ls -la .env.local      # macOS/Linux
dir .env.local         # Windows

# Create if missing:
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
EOF
```

### **Issue 2: Wrong URL format**
❌ Wrong:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co/rest/v1
```

✅ Correct:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

### **Issue 3: Copy-paste spaces**
If you copied from a formatted doc, there might be hidden spaces:
```
# ❌ Wrong (has space at end):
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co 

# ✅ Correct:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

### **Issue 4: Realtime still disabled**
Check Supabase dashboard:
1. Go to **Database** menu
2. Select **Replication**
3. Look for `messages` table
4. If toggle is OFF (gray), click it to enable
5. Wait for green confirmation
6. Restart dev server

---

## 🚀 After Fixing

Once you see "✅ Realtime SUBSCRIBED" in console:

1. **Send a test message** from one browser
2. **Open chat in another browser**
3. Message should appear **instantly** ✨

If it still doesn't work:
- Open **Network tab** in DevTools
- You should see WebSocket connection: `wss://`
- If missing, Realtime still not working

---

## 📝 What to Do If Live Updates Don't Work

**Important:** Even without Realtime, chat **still works perfectly**!

The app uses:
- ✅ **Backend API for loading messages** (always works)
- ✅ **Backend API for sending messages** (always works)
- ⚠️ **Supabase Realtime for live updates** (optional)

If Realtime fails, users just need to refresh the page to see new messages, but can still send/receive messages.

---

## 🆘 Still Not Working?

1. **Check the error message in console** - copy it
2. **Verify Realtime is enabled** on messages table
3. **Verify credentials are correct** (URL and key)
4. **Check browser Network tab** for WebSocket errors
5. **Try incognito mode** (disables extensions that might interfere)

If still broken:
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Useful Links

- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Enable Realtime in Dashboard](https://supabase.com/docs/guides/realtime/quickstart)
- [Troubleshoot Realtime Issues](https://supabase.com/docs/guides/realtime/troubleshooting)

---

## 💡 Summary

| Issue | Solution |
|-------|----------|
| TIMED_OUT error | Enable Realtime on messages table |
| "Missing credentials" | Add values to `.env.local` |
| Server restart needed | Run `npm run dev` again |
| Still no live updates | Check Network tab for WebSocket |
| Can't find .env.local | Create it in project root |

**Remember:** Chat works even without Realtime. If you see an error but messages are loading, your setup is mostly correct!
