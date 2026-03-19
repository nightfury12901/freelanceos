---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Next.js Scaffold + Supabase Configuration

## Objective
Bootstrap the entire project from scratch: Next.js 14 App Router with TypeScript strict, install all dependencies, configure Tailwind + shadcn/ui, create Supabase project schema (all 5 tables + RLS policies + Storage bucket), and set up environment variables and Supabase client helpers.

## Context
- `.gsd/SPEC.md` — stack, schema, constraints
- `.gsd/DECISIONS.md` — ADR-001 (Server Components default), ADR-002 (Supabase), ADR-005 (strict TS)

## Tasks

<task type="auto">
  <name>Scaffold Next.js 14 + Install All Dependencies</name>
  <files>
    package.json
    tsconfig.json
    next.config.ts
    tailwind.config.ts
    postcss.config.js
    .env.local
    .env.example
    .gitignore
  </files>
  <action>
    1. Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`
    2. Install production deps:
       `npm install @supabase/supabase-js @supabase/ssr framer-motion @react-pdf/renderer zod razorpay resend lucide-react class-variance-authority clsx tailwind-merge`
    3. Install shadcn/ui: `npx shadcn@latest init` (select: Default style, Slate base color, CSS variables yes)
    4. Install shadcn components needed: `npx shadcn@latest add button card badge dialog sheet tabs toggle-group separator tooltip skeleton`
    5. In `tsconfig.json` ensure `"strict": true` is set.
    6. In `next.config.ts` add: `serverExternalPackages: ['@react-pdf/renderer']` (prevents client bundle inclusion)
    7. Create `.env.local` with all keys placeholdered. Create `.env.example` (same keys, no values).
    8. Add `server-only` package: `npm install server-only`

    **Avoid:**
    - Do NOT use `--turbo` flag in dev script (compatibility issues with @react-pdf)
    - Do NOT allow `@react-pdf/renderer` to be imported from Client Components
  </action>
  <verify>
    `npm run build` must complete with 0 errors.
    `npx tsc --noEmit` must complete with 0 errors.
  </verify>
  <done>
    - `package.json` contains all listed dependencies
    - `tsconfig.json` has `"strict": true`
    - `next.config.ts` has `serverExternalPackages: ['@react-pdf/renderer']`
    - `.env.local` and `.env.example` exist with all required keys
    - `npm run build` exits 0
  </done>
</task>

<task type="auto">
  <name>Supabase Client Helpers + Environment Setup</name>
  <files>
    lib/supabase/client.ts
    lib/supabase/server.ts
    lib/supabase/middleware.ts
    middleware.ts
    lib/supabase/types.ts
  </files>
  <action>
    1. Create `lib/supabase/client.ts` — browser client using `createBrowserClient` from `@supabase/ssr`
    2. Create `lib/supabase/server.ts` — server client using `createServerClient` from `@supabase/ssr` with cookie handling (for App Router Server Components and Route Handlers)
    3. Create `lib/supabase/middleware.ts` — session refresh helper
    4. Create `middleware.ts` at project root — intercept all routes, refresh session, redirect unauthenticated users away from `/dashboard/**` to `/auth/login`
    5. Create `lib/supabase/types.ts` — export `Database` type (placeholder until Supabase CLI generates it; shape it manually from SPEC schema)

    **Pattern for server.ts** (App Router cookie-based):
    ```ts
    import { createServerClient } from '@supabase/ssr'
    import { cookies } from 'next/headers'
    export async function createClient() {
      const cookieStore = await cookies()
      return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll() { return cookieStore.getAll() }, setAll(cs) { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } } })
    }
    ```

    **Avoid:**
    - Do NOT use `createClient` from `@supabase/supabase-js` directly in Server Components (use `@supabase/ssr` wrapper)
    - Do NOT store tokens in localStorage (cookie-based session only)
  </action>
  <verify>
    `npx tsc --noEmit` passes.
    Import `createClient` from `lib/supabase/server` in a test Server Component and confirm no type errors.
  </verify>
  <done>
    - `lib/supabase/client.ts`, `server.ts`, `middleware.ts` all exist and compile
    - `middleware.ts` at root redirects unauthenticated `/dashboard` access
    - No TypeScript errors
  </done>
</task>

<task type="auto">
  <name>Supabase Database Schema + RLS + Storage</name>
  <files>
    supabase/migrations/001_initial_schema.sql
    supabase/migrations/002_rls_policies.sql
    supabase/migrations/003_storage.sql
  </files>
  <action>
    1. Create `supabase/migrations/001_initial_schema.sql`:
       - `users` table: `id uuid references auth.users primary key`, `email text`, `name text`, `gstin text`, `profession text`, `lut_filed boolean default false`, `turnover_bracket text`, `plan_tier text default 'free'`, `created_at timestamptz default now()`
       - `invoices` table: `id uuid primary key default gen_random_uuid()`, `user_id uuid references users(id) on delete cascade`, `type text check(type in ('domestic','export'))`, `client_name text`, `client_gstin text`, `items jsonb`, `total numeric(12,2)`, `gst_amount numeric(12,2)`, `lut_num text`, `pdf_url text`, `created_at timestamptz default now()`
       - `contracts`, `documents`, `reminders` tables per SPEC schema
    2. Create `supabase/migrations/002_rls_policies.sql`:
       - Enable RLS on all 5 tables
       - Policy pattern: `CREATE POLICY "Users own data" ON [table] FOR ALL USING (auth.uid() = user_id)`
       - For `users` table: `USING (auth.uid() = id)`
    3. Create `supabase/migrations/003_storage.sql`:
       - Create private bucket `compliance-docs`
       - Policy: only authenticated users can upload to `{user_id}/*`
       - Policy: only the owning user can read their own files

    **Avoid:**
    - Do NOT use `public` bucket (all files must be private, accessed via signed URLs)
    - Do NOT skip RLS — all tables must have it enabled
  </action>
  <verify>
    Apply migrations via Supabase CLI: `npx supabase db push` or paste SQL in Supabase Studio SQL editor.
    Check Supabase Dashboard: all 5 tables exist, RLS is ON for each, storage bucket `compliance-docs` is private.
  </verify>
  <done>
    - All 3 migration files exist in `supabase/migrations/`
    - 5 tables created in Supabase with correct columns
    - RLS enabled + user-scoped policies on all tables
    - Private storage bucket `compliance-docs` created
  </done>
</task>

## Success Criteria
- [ ] `npm run build` exits 0 with no TypeScript errors
- [ ] All 5 Supabase tables created with RLS enabled
- [ ] Private storage bucket `compliance-docs` exists
- [ ] Middleware redirects unauthenticated users from `/dashboard` to `/auth/login`
- [ ] `.env.example` documents all required environment variables
