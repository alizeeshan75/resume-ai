# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma migrate dev       # Apply schema migrations in development
npx prisma studio            # Open database GUI
```

No test framework is configured.

## Architecture

**Resume AI MVP** — AI-powered resume builder with regional formatting (US, UK, EU, MENA, Asia) and industry-specific optimization.

### Tech Stack

- **Next.js 16 (App Router)** with React 19 and TypeScript
- **Tailwind CSS v4** for styling
- **NextAuth v5** (`next-auth@5.0.0-beta.30`) for authentication with Prisma adapter
- **Prisma 5** ORM against **PostgreSQL on Supabase**
- **Google Gemini AI** (`@google/generative-ai`) — primary AI model (`gemini-2.0-flash`)
- **Anthropic Claude** (`@anthropic-ai/sdk`) — secondary AI model (`claude-3.5-sonnet`)
- **Zustand** for client state, **TanStack React Query** for server state
- **dnd-kit** for drag-and-drop resume section reordering
- **Zod** for schema validation

### Data Model (prisma/schema.prisma)

- `User` → has many `Resume`, `InterviewSession`; has one `Profile`
- `Profile` → has many `Experience`, `Education`
- `Resume` → has many `ResumeVersion`, `InterviewSession`; stores content as JSON with `targetRegion` and `targetIndustry`
- `GenerationLog` — logs AI calls including `modelUsed`, `tokensUsed`, `latencyMs`, `promptType`
- `Account` / `Session` / `VerificationToken` — NextAuth tables

### API Routes

API routes live under `app/api/`. Currently `app/api/resume/` exists but endpoints are not yet implemented.

### Key Conventions

- Path alias `@/` maps to the project root (e.g., `@/lib/prisma`)
- Prisma client is a singleton in `lib/prisma.ts`
- Gemini is the primary AI; Anthropic SDK is available as a secondary option
- `GenerationLog` should be written after every AI generation call (model, tokens, latency, region, industry)

## Environment Variables

Required in `.env.local`:

```
DATABASE_URL          # PostgreSQL connection string (Supabase)
GEMINI_API_KEY        # Google Gemini API key
NEXTAUTH_SECRET       # NextAuth session secret
NEXTAUTH_URL          # e.g. http://localhost:3000
NEXT_PUBLIC_APP_URL   # Public-facing URL (exposed to client)
```
