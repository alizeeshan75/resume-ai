# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured. Prisma has been removed — schema is managed directly in the Supabase SQL editor.

## Architecture

**Resume AI MVP** — AI-powered resume builder with regional formatting (US, UK, EU, MENA, Asia) and industry-specific optimization.

### Tech Stack

- **Next.js 16 (App Router)** with React 19 and TypeScript
- **Tailwind CSS v4** for styling
- **Supabase Auth** for authentication (replaces NextAuth + Prisma adapter)
- **Supabase JS client** (`@supabase/supabase-js` + `@supabase/ssr`) for all database operations
- **Google Gemini AI** (`@google/generative-ai`) — primary AI model (`gemini-2.0-flash`)
- **Anthropic Claude** (`@anthropic-ai/sdk`) — secondary AI model (`claude-3.5-sonnet`)
- **Zustand** for client state, **TanStack React Query** for server state
- **dnd-kit** for drag-and-drop resume section reordering
- **Zod** for schema validation

### Data Model (managed in Supabase SQL editor)

All tables live in the `public` schema. Supabase Auth owns `auth.users`.

- `profiles` — extends `auth.users` (1-to-1, auto-created on signup via trigger); holds bio, skills, languages, social_links, subscription_status, region_preference
- `experiences` — belongs to `profiles`
- `education` — belongs to `profiles`
- `resumes` — belongs to `auth.users`; stores `content` as JSONB with `target_region` and `target_industry`
- `resume_versions` — belongs to `resumes`
- `interview_sessions` — belongs to `auth.users`, optionally to `resumes`
- `generation_logs` — logs AI calls: model_used, tokens_used, latency_ms, prompt_type, region, industry

Row Level Security (RLS) is enabled on all tables — users can only access their own rows.

### Supabase Client Helpers

Three client helpers under `lib/supabase/`:

- `lib/supabase/client.ts` — browser client for Client Components (`createBrowserClient`)
- `lib/supabase/server.ts` — async server client for Server Components, Route Handlers, Server Actions (`createServerClient` + Next.js cookies)
- `lib/supabase/admin.ts` — service-role client that bypasses RLS (server-only, never import in client code)

Session is kept alive by `proxy.ts` at the project root (Next.js 16 renamed `middleware.ts` → `proxy.ts`; the exported function must be named `proxy`).

### API Routes

API routes live under `app/api/`. Currently `app/api/resume/` exists but endpoints are not yet implemented.

### Key Conventions

- Path alias `@/` maps to the project root (e.g., `@/lib/supabase/server`)
- Always use the server client (`lib/supabase/server.ts`) in Server Components and API routes
- Use the browser client (`lib/supabase/client.ts`) only in Client Components
- Use the admin client (`lib/supabase/admin.ts`) only for privileged server-side operations
- `generation_logs` should be written after every AI generation call (model, tokens, latency, region, industry)

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL        # Project URL from Supabase dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Anon/public key (safe to expose to browser)
SUPABASE_SERVICE_ROLE_KEY       # Service role key (server-side only, never expose to client)
GEMINI_API_KEY                  # Google Gemini API key
NEXT_PUBLIC_APP_URL             # Public-facing URL (e.g. http://localhost:3000)
```
