# SPEC.md — Freelancer Compliance OS

> **Status**: `FINALIZED`
> **Created**: 2026-03-18
> **Version**: 1.0

---

## Vision

A production-grade SaaS at ₹299/month that eliminates GST & tax compliance anxiety for Indian freelancers. Every Indian freelancer who raises invoices, files GSTR-1, tracks foreign remittances, or manages contracts gets a single dashboard replacing 5 spreadsheets and 3 CA consultations per year. Stunning UI that converts on landing, backend that just works without babysitting.

---

## Goals

1. **Revenue-generating compliance tool** — Paid subscriptions via Razorpay at ₹299/₹499/mo or ₹1999/yr
2. **GST-correct invoice generation** — Domestic and export (LUT) invoices with proper PDF, SAC codes, and GSTIN validation
3. **Compliance dashboard** — Single-glance status for LUT, GSTR-1, ITR, e-FIRA, GST registration
4. **Contract management** — NDA / SOW / Retainer templates as editable, downloadable PDFs
5. **e-FIRA tracking** — Foreign remittance evidence upload and CSV export per invoice
6. **Subscription gating** — Free tier (3 invoices/mo), Paid tier (unlimited) with hard enforcement

---

## Non-Goals (Out of Scope — v1)

- Actual CA filing or CA integration (not a CA platform)
- Multi-user / team accounts
- Mobile app (web-first, mobile-responsive)
- International users outside India
- Automated bank statement parsing
- Direct GSTN API integration (manual GSTIN input only)
- Xero / QuickBooks sync

---

## Users

**Primary:** Indian freelancers (developers, designers, marketers) earning ₹6L–₹50L/yr who manage their own compliance or use a CA infrequently. They file GST quarterly/monthly, issue 3–20 invoices/month, and have zero tolerance for tax errors that cause CA rework fees.

**Secondary:** Bootstrapped freelance studio owners (1–3 person shops) managing multiple clients.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router (TypeScript strict) |
| UI Components | shadcn/ui + Tailwind CSS |
| Animation | Framer Motion |
| Auth + DB | Supabase (Auth, PostgreSQL, Storage) |
| PDF | @react-pdf/renderer (server-only) |
| Payments | Razorpay (subscriptions + webhooks) |
| Email | Resend |
| Deployment | Vercel |

---

## Database Schema

```sql
users(id, email, name, gstin, profession, lut_filed, turnover_bracket, plan_tier)
invoices(id, user_id, type, client_name, client_gstin, items[], total, gst_amount, lut_num, pdf_url, created_at)
contracts(id, user_id, template_type, fields_json, pdf_url, created_at)
documents(id, user_id, invoice_id, file_url, doc_type, created_at)
reminders(id, user_id, type, due_date, sent, created_at)
```

---

## Constraints

- **Technical**: Server Components default; Client Components only for forms/motion. No `any` types.
- **Security**: Supabase RLS on all tables. Private storage bucket. Zod validation on all API routes.
- **Performance**: PDF rendered server-side only (no client leaks). Vercel Edge where applicable.
- **Code org**: `lib/constants.ts` for all tax/SAC/dates. `lib/animations.ts` for Motion variants. Components in `ui/` + `app/`.
- **Timeline**: 5 phases, ship MVP in ~10 sessions.
- **Budget**: Minimize third-party paid services. Razorpay + Resend + Supabase free tiers to start.

---

## UI System

| Element | Spec |
|---------|------|
| Colors | Navy `#0f172a` + Teal `#14b8a6` + Glassmorphism |
| Animation duration | 200–300ms |
| Reduced motion | `prefers-reduced-motion: true` respected |
| Hero style | Kinetic text stagger (basement.studio inspired) |
| Cards | 3D hover lift + staggerChildren (Aceternity inspired) |
| Transitions | Slide-up (Olivier Larose inspired) |
| Dashboard | shadcn bento + Framer Motion |

---

## Success Criteria

- [ ] Landing page converts with hero, pricing toggle, and Razorpay checkout
- [ ] User can register, log in, and access dashboard via Supabase Auth
- [ ] Domestic GST invoice generated as correct PDF with SAC codes
- [ ] Export (LUT) invoice generated with LUT number, zero GST
- [ ] e-FIRA tracker accepts file uploads and exports CSV
- [ ] Contracts generate editable PDFs for NDA, SOW, Retainer
- [ ] Compliance dashboard shows 5 live status cards with animated score
- [ ] Subscription gating enforced: Free tier capped at 3 invoices/mo
- [ ] Razorpay webhook syncs subscription status to `users.plan_tier`
- [ ] All API routes protected by Supabase RLS + Zod validation
