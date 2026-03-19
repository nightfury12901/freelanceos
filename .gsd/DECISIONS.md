# DECISIONS.md — Architecture Decision Record

> **Project**: Freelancer Compliance OS
> **Created**: 2026-03-18

---

## ADR-001: Next.js 14 App Router with Server Components Default

**Status**: Accepted
**Date**: 2026-03-18
**Context**: Need SEO-friendly pages, server-side PDF rendering, and fast initial loads.
**Decision**: Use Next.js 14 App Router. All components are Server Components by default. Client Components (`'use client'`) only for forms, Framer Motion animations, and interactive state.
**Consequences**: Must be careful with hydration boundaries. No direct DB access in Client Components.

---

## ADR-002: Supabase for Auth + DB + Storage

**Status**: Accepted
**Date**: 2026-03-18
**Context**: Need auth, Postgres DB with RLS, and file storage in one platform.
**Decision**: Use Supabase. Row Level Security enforced on all tables. Private storage bucket for PDF/image files.
**Consequences**: Must configure RLS policies correctly before any data access. Supabase client has two instances: `browser` + `server` (using cookies).

---

## ADR-003: PDF Generation — Server-Only @react-pdf/renderer

**Status**: Accepted
**Date**: 2026-03-18
**Context**: Invoice/contract PDFs must be generated securely without exposing tax logic to client.
**Decision**: All PDF rendering happens in `app/api/` route handlers only. PDFs uploaded to Supabase Storage, signed URL returned to client.
**Consequences**: No PDF generation in browser. Increases server load but eliminates data leakage risk.

---

## ADR-004: Razorpay Subscriptions (not one-time payments)

**Status**: Accepted
**Date**: 2026-03-18
**Context**: ₹299/₹499/mo recurring billing required.
**Decision**: Use Razorpay Subscription Plans API. Webhook at `/api/webhooks/razorpay` syncs `users.plan_tier` on `subscription.activated`, `subscription.charged`, `subscription.cancelled`.
**Consequences**: Must validate webhook HMAC signature. Subscription state drives feature gating.

---

## ADR-005: TypeScript Strict Mode — No `any`

**Status**: Accepted
**Date**: 2026-03-18
**Decision**: `strict: true` in `tsconfig.json`. ESLint rule `@typescript-eslint/no-explicit-any: error`. All types must be explicitly declared.
**Consequences**: Slower initial development but eliminates runtime type bugs at scale.
