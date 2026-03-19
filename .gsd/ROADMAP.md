# ROADMAP.md — Freelancer Compliance OS

> **Current Phase**: Phase 1
> **Milestone**: v1.0 MVP
> **Last Updated**: 2026-03-18

---

## Must-Haves (from SPEC)

- [ ] Supabase Auth (email + Google OAuth)
- [ ] Landing page with hero, pricing, and Razorpay checkout
- [ ] GST invoice generation (domestic + export/LUT)
- [ ] e-FIRA tracker with drag-drop upload per invoice
- [ ] Contract templates (NDA / SOW / Retainer) with PDF download
- [ ] Compliance dashboard (5 status cards + animated score)
- [ ] Subscription gating (Free: 3 invoices/mo, Paid: unlimited)
- [ ] Razorpay webhook subscription sync

---

## Phases

### Phase 1: Foundation — Supabase + Auth + Landing
**Status**: 🟡 In Progress
**Objective**: Scaffold the Next.js 14 project, configure Supabase (Auth, DB schema, RLS, Storage), build the full Landing page (hero, features bento, pricing toggle, footer with Razorpay CTA), and wire up Auth flow (sign-in, sign-up, dashboard redirect).
**Requirements**: REQ-01 (project scaffold), REQ-02 (Supabase), REQ-03 (Auth), REQ-04 (Landing)
**Deliverables**:
- `next.config.ts`, `tailwind.config.ts`, `lib/supabase/` client + server helpers
- Supabase migrations: all 5 tables + RLS policies
- `/` landing page: hero (kinetic text), 6 bento features, pricing toggle, testimonials carousel, footer
- `/auth/login`, `/auth/register`, `/auth/callback` routes
- Dashboard shell at `/dashboard` (auth-gated)

---

### Phase 2: Invoice Engine — Domestic GST + PDF
**Status**: ⬜ Not Started
**Objective**: Build the full invoice creation form (domestic + export toggle), server-side PDF rendering with @react-pdf/renderer, SAC code dropdown, live client-side preview, and download flow.
**Requirements**: REQ-05 (invoice form), REQ-06 (PDF server render), REQ-07 (download)
**Deliverables**:
- `/dashboard/invoices/new` — form with AnimatePresence domestic/export toggle
- `app/api/invoices/create` — Zod validated, RLS enforced, subscription gated
- `app/api/invoices/[id]/pdf` — server-only PDF generation + Supabase Storage upload
- Invoice list at `/dashboard/invoices`
- `lib/constants.ts` (SAC codes, GST rates, LUT fields)

---

### Phase 3: Export Invoices + e-FIRA Tracker
**Status**: ⬜ Not Started
**Objective**: Add export invoice support (LUT invoices, zero GST), build the e-FIRA tracker with drag-drop file upload per invoice row, file chips UI, and CSV export.
**Requirements**: REQ-08 (export invoices), REQ-09 (e-FIRA tracker), REQ-10 (CSV export)
**Deliverables**:
- Export invoice PDF variant (LUT number, zero GST, foreign currency)
- `/dashboard/efira` — invoice table + drag-drop upload per row
- `app/api/documents/upload` — private bucket, PDF/image only, virus-scan mime check
- CSV export endpoint
- `documents` table integration

---

### Phase 4: Contracts + Compliance Dashboard
**Status**: ⬜ Not Started
**Objective**: Build the 3 contract template cards (glassmorphism), slide-up modal editor, contract PDF generation; then build the compliance dashboard with animated score counter and 5 live status cards.
**Requirements**: REQ-11 (contracts), REQ-12 (dashboard cards), REQ-13 (compliance score)
**Deliverables**:
- `/dashboard/contracts` — 3 cards + slide-up modal + editable fields
- `app/api/contracts/generate` — PDF from filled fields_json
- `/dashboard` home — animated counter 0→100, 5 status cards (LUT, GSTR-1, ITR, e-FIRA, GST)
- Hover scale(1.02) + shadow glow on each card (Framer Motion)

---

### Phase 5: Billing + Limits + Reminders + Launch Polish
**Status**: ⬜ Not Started
**Objective**: Wire Razorpay subscriptions end-to-end (checkout, webhook, tier sync), enforce Free/Paid limits across all gated endpoints, set up Resend email reminders for GSTR-1/ITR due dates, and apply final UI polish.
**Requirements**: REQ-14 (Razorpay), REQ-15 (subscription gate), REQ-16 (reminders), REQ-17 (launch)
**Deliverables**:
- `/dashboard/billing` — plan display, upgrade CTA, Razorpay checkout session
- `app/api/webhooks/razorpay` — subscription event sync to `users.plan_tier`
- Subscription gate middleware on all gated routes
- `reminders` cron job via Vercel Cron + Resend
- Final SEO, OG images, sitemap, robots.txt
