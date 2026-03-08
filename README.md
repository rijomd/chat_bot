## Getting Started

## Setup Instructions

### 1. Install Dependencies
npm install
npm run db:migrate
npm run db:seed

### 2. Configure Supabase Realtime

Update `.env.local` with your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Enable Realtime on the messages table in Supabase:
- Go to Database → Replication
- Enable replication for the `messages` table (else Realtime will NOT emit any events , but works normal insert, update, delete)

### 3. Run the Development Server

npm run dev
http://localhost:3000 in your browser.

## Project Structure

- `prisma/` - Database schema and migrations
- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/lib/` - Utilities and hooks
- `src/actions/` - Server actions
- `src/types/` - TypeScript type definitions

## Features

For detailed Supabase Realtime setup, see [SUPABASE_REALTIME_GUIDE.md](SUPABASE_REALTIME_GUIDE.md)

## Database Schema Tables
- `users` - User accounts
- `conversations` - Chat conversations
- `conversation_participants` - Users in each conversation
- `messages` - Chat messages (Realtime enabled)

###  Enable Realtime for Messages Table

In Supabase Dashboard:
1. Go to the SQL Editor
2. Run this command to enable realtime on the messages table:

sql :- ALTER PUBLICATION supabase_realtime ADD TABLE messages;

1. Go to Database → Replication
2. Enable replication for the `messages` table

It is your ISP’s broken IPv6 routing for WebSockets. (use vpn)

### use reddis (optional)
for user message history

##### 4

prisma client regenerate 
npx prisma generate

migration changes initially:-
npx prisma migrate dev --name init (migration folder under prisma folder) (eg :- npx prisma migrate dev --name migrations)

Any schema changes:-
prisma db push 

for seed or data push :-
seed file under prisma folder.
add this on package file.

npm run db:migrate
npm run db:seed
for view :- npm run db:studio


for clear cache
Remove-Item -Recurse -Force node_modules\.prisma
then run migration

npx prisma db pull : Synchronize your Prisma schema with your existing database

Most of the timenpm run db:migrateKeeps your DB and code in sync and saves a history of changes.Just testing / Draftsnpm run db:pushFaster; avoids cluttering your project with many small migration files.Code doesn't see changesnpm run db:generateUse this if your DB is updated but your TypeScript types are still old.

##### 5
authentication
jwt and next auth are using.
packages are bcrypt and jsonwebtoken.


###### 6
No need to pass token manually - session cookies handle it.
needs literal string values - it can't use imported constants because Next.js parses this at build time before your code runs.


###### env sample :- 
DB_SUPABASE_URL = "   "
NEXTAUTH_URL = http://localhost:3000
NEXT_PUBLIC_BASE_URL = http://localhost:3000
NEXTAUTH_SECRET = "    "
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
AI_API_KEY

##### 9
working :- 
    1.Remember Me" is checked
      checks token expiry every no.of (defined) seconds.
      5(defined) minutes remain, warning modal appears.
      User can either dismiss or extend the session.
    2.Remember Me" is unchecked
      immediate logout

###### 10
 auth.ts => signout for   
             signOut() called
             session destroyed
             events.signOut runs (optional hook) :- Optional: Add backend cleanup here if needed
