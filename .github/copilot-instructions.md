This repository is a Next.js (App Router) + Prisma + NextAuth example for a small chat UI.

Key facts for an AI coding agent (be concise and actionable):

- Project layout: uses Next.js App Router under `src/app/` (pages are React Server Components by default). See `src/app/layout.tsx` and `src/app/providers.tsx` for global wrappers and the session provider.
- Authentication: NextAuth with Credentials provider. Config is in `src/lib/auth.ts`. Server-side auth middleware lives in `src/lib/middleware.ts` and redirects unauthenticated users to `/login` and authenticated users away from `/login` and `/signup` to `/dashboard`.
- Database: Prisma with Postgres (Supabase URL). Schema in `prisma/schema.prisma`, client wrapper in `src/lib/db.ts` (uses `@prisma/extension-accelerate`). Seed script at `prisma/seed.ts` and configured via `package.json` `prisma.seed`.
- API surface: Next.js route handlers live under `src/app/api/`. The frontend calls an internal API at `http://localhost:3000/api` (see `src/constants/authConstants.ts` and `src/actions/authActions.ts`). Keep relative imports consistent with the client/server boundary.

Conventions and patterns to follow when changing code:

- File types: When adding UI, prefer React Server Components in `src/app/*` unless you need client-only hooks (like `useSession`) — then add `'use client'` at the top (see `src/lib/hook.ts` and `src/app/providers.tsx`).
- Auth flow: Login requests are proxied to `POST /api/user/login` and `POST /api/user/signIn` (see `src/actions/authActions.ts`). The NextAuth Credentials provider calls `loginInActions` to authorize.
- Session handling: Session strategy uses JWT (see `src/lib/auth.ts` callbacks). If you need access to `accessToken` or `id` add them to the token/session callbacks.
- DB access: Use the exported `DB` from `src/lib/db.ts`. It applies `withAccelerate()` — prefer `DB` everywhere to reuse the same client and avoid creating multiple Prisma clients in dev.
- Secrets: Some secrets are hard-coded in `src/constants/authConstants.ts` (e.g. `NEXT_AUTH_SECRET`). Treat these as placeholders; for production use env vars and `process.env`.

Developer workflows (commands discovered in repo):

- Run dev server (uses turbo pack):

  npm run dev

- Build and start:

  npm run build
  npm run start

- Prisma workflows:

  npx prisma generate
  npx prisma migrate dev --name init
  npx prisma db push
  npx prisma db seed  (configured to run `tsx prisma/seed.ts` via package.json)

Integration points and important details:

- External services: Postgres via `DB_SUPABASE_URL` env var. NextAuth uses JWTs; provider is Credentials that hits internal API endpoints.
- Frontend ↔ API: Frontend code in `src/actions/*` calls the API via `BASE_API_URL` in `src/constants/authConstants.ts` which points to `http://localhost:3000/api` — prefer relative API routes when refactoring to avoid host dependence.
- Middleware: `src/lib/middleware.ts` uses `next-auth/middleware` and `req.nextauth.token` to decide redirects — changing middleware must preserve these checks.

Examples to reference when making changes:

- Authorization callback storing access token: `src/lib/auth.ts` (jwt/session callbacks).
- Client-side redirect based on session: `src/lib/hook.ts` (useAuth hook).
- Server DB client and accelerate usage: `src/lib/db.ts`.
- API-calling actions: `src/actions/authActions.ts`.

When editing or extending:

- Keep client vs server boundary in mind: components under `src/app` are server components by default; add `"use client"` only where needed.
- Reuse `DB` and `authOptions` exports instead of reinitializing clients/providers.
- Avoid committing real secrets; replace hard-coded secrets with `process.env` and note where to change `.env`.

If something is ambiguous, helpful places to inspect:

- `package.json` (scripts and prisma.seed)
- `src/lib/*` (auth, db, middleware, hook)
- `src/actions/*` (how UI calls API)
- `prisma/schema.prisma` and `prisma/seed.ts`

If you need more detail or prefer a different structure for these instructions, tell me which sections to expand (dev flow, auth, prisma, UI patterns).
