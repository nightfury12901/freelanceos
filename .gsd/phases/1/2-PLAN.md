---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Auth Flow (Sign-in / Sign-up / Callback)

## Objective
Build the complete authentication flow: sign-up page, sign-in page, OAuth callback handler, auth actions (server actions), and the protected dashboard shell. Users should be able to register with email/password, log in, be redirected to `/dashboard`, and log out.

## Context
- `.gsd/SPEC.md` — auth requirements, Supabase stack
- `.gsd/DECISIONS.md` — ADR-001 (Server Components), ADR-002 (Supabase SSR)
- `lib/supabase/server.ts` — server client (from Plan 1.1)
- `lib/supabase/client.ts` — browser client (from Plan 1.1)
- `middleware.ts` — auth guard (from Plan 1.1)

## Tasks

<task type="auto">
  <name>Auth Pages — Sign-up + Sign-in UI</name>
  <files>
    app/auth/login/page.tsx
    app/auth/register/page.tsx
    app/auth/callback/route.ts
    app/auth/actions.ts
    components/ui/auth-form.tsx
  </files>
  <action>
    1. Create `app/auth/actions.ts` — Server Actions file (`'use server'`):
       - `signUp(formData: FormData)`: validate email/password with Zod, call `supabase.auth.signUp()`, handle `email already registered` error, redirect to `/auth/login?message=Check your email`
       - `signIn(formData: FormData)`: validate with Zod, call `supabase.auth.signInWithPassword()`, redirect to `/dashboard` on success, return error message on failure
       - `signOut()`: call `supabase.auth.signOut()`, redirect to `/`

    2. Create `components/ui/auth-form.tsx` — Client Component (`'use client'`):
       - Framer Motion entrance animation (slide-up + fade, 300ms)
       - Email + Password inputs with shadcn `Input` + `Label`
       - Submit button with loading state (shadcn `Button` + `Loader2` icon)
       - Error message display (red, below form)
       - Link to switch between login/register

    3. Create `app/auth/login/page.tsx` — Server Component that renders `AuthForm` with mode="login"
    4. Create `app/auth/register/page.tsx` — Server Component that renders `AuthForm` with mode="register"
    5. Create `app/auth/callback/route.ts` — Route Handler:
       - Exchange `code` param for session via `supabase.auth.exchangeCodeForSession(code)`
       - On success: insert row into `users` table (if first login), redirect to `/dashboard`
       - On error: redirect to `/auth/login?error=Could not authenticate`

    **Styling:**
    - Background: Navy `#0f172a` (full page)
    - Card: glassmorphism (`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl`)
    - Logo/brand mark at top of card
    - Teal accent on submit button (`bg-teal-500 hover:bg-teal-400`)

    **Avoid:**
    - Do NOT use `useRouter` for redirects in Server Actions (use `redirect()` from `next/navigation`)
    - Do NOT store password in DB (Supabase Auth handles this)
    - Do NOT use client-side fetch for auth — use Server Actions only
  </action>
  <verify>
    1. Navigate to `http://localhost:3000/auth/register` — form renders, no console errors
    2. Register with test email — check Supabase Auth dashboard for user entry
    3. Log in with same credentials — confirm redirect to `/dashboard`
    4. Visit `/dashboard` while logged out — confirm redirect to `/auth/login`
  </verify>
  <done>
    - Register, login, and logout flows work end-to-end
    - Unauthenticated users redirected from `/dashboard` to `/auth/login`
    - Auth errors displayed in UI (not just console)
    - `users` table row created on first login
  </done>
</task>

<task type="auto">
  <name>Dashboard Shell — Layout + Navigation</name>
  <files>
    app/dashboard/layout.tsx
    app/dashboard/page.tsx
    components/ui/dashboard-nav.tsx
    components/ui/user-menu.tsx
    lib/animations.ts
    lib/constants.ts
  </files>
  <action>
    1. Create `app/dashboard/layout.tsx` — Server Component:
       - Verify user session via `createClient()` from `lib/supabase/server`
       - If no session, redirect to `/auth/login`
       - Render sidebar nav + main content slot
       - Sidebar: fixed left, Navy background, width 240px

    2. Create `components/ui/dashboard-nav.tsx` — Client Component:
       - Nav items with icons (Lucide): Dashboard (LayoutDashboard), Invoices (FileText), e-FIRA (Globe), Contracts (FileSignature), Billing (CreditCard)
       - Active state: teal left border + teal text
       - Hover: `bg-white/5` transition 200ms
       - Framer Motion: staggerChildren 0.05s entrance on mount

    3. Create `components/ui/user-menu.tsx` — Client Component:
       - Shows user email + avatar initials
       - Dropdown with: Profile, Sign Out
       - Sign Out calls `signOut()` server action

    4. Create `app/dashboard/page.tsx` — placeholder for now (compliance score + cards come in Phase 4):
       - Show "Welcome back, {name}" heading
       - Show 5 skeleton cards (shadcn `Skeleton`) in bento grid layout
       - Text: "Compliance dashboard coming in next phase"

    5. Create `lib/animations.ts` — reusable Framer Motion variants:
       ```ts
       export const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
       export const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
       export const scaleOnHover = { whileHover: { scale: 1.02 }, transition: { duration: 0.2 } }
       ```

    6. Create `lib/constants.ts` — all shared constants:
       - `SAC_CODES`: `{ dev: '998314', design: '998313', marketing: '998361' }`
       - `GST_RATES`: `{ standard: 18, export: 0 }`
       - `PLAN_LIMITS`: `{ free: { invoices: 3 }, paid: { invoices: Infinity } }`
       - `GSTR1_DUE_DAY`: 11 (11th of following month)
       - `SUBSCRIPTION_PLANS`: array with id, name, price, interval

    **Avoid:**
    - Do NOT put `'use client'` on dashboard layout (it's a Server Component that fetches session)
    - Do NOT hardcode user data — always fetch from Supabase
  </action>
  <verify>
    1. Log in → confirm `/dashboard` loads with sidebar nav visible
    2. Click each nav item — confirm route changes (pages can be empty for now)
    3. Click Sign Out — confirm redirect to `/`
    4. `npx tsc --noEmit` — 0 errors
  </verify>
  <done>
    - Dashboard layout renders with sidebar nav and user menu
    - All 5 nav routes exist (can be empty pages)
    - `lib/animations.ts` exports `fadeUp`, `staggerContainer`, `scaleOnHover`
    - `lib/constants.ts` exports all shared constants
    - TypeScript compiles with 0 errors
  </done>
</task>

## Success Criteria
- [ ] Full auth cycle works: register → verify email → login → dashboard → logout
- [ ] Unauthenticated access to `/dashboard/**` redirects to `/auth/login`
- [ ] Dashboard shell renders with sidebar, nav, and user menu
- [ ] `lib/animations.ts` and `lib/constants.ts` are populated and typed
- [ ] 0 TypeScript errors (`npx tsc --noEmit`)
