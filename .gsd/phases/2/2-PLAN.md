---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: Invoice API & Database Storage

## Objective
Handle form submission from Plan 2.1, RLS insert to the database, and display the list of invoices at `/dashboard/invoices`.

## Context
- .gsd/SPEC.md
- src/app/api/invoices/route.ts
- src/app/dashboard/invoices/page.tsx

## Tasks

<task type="auto">
  <name>Invoice APIs</name>
  <files>src/app/api/invoices/route.ts</files>
  <action>
    - Parse POST request with Zod schema.
    - Enforce Supabase auth session.
    - Insert into `invoices` table. Limit checks based on user's subscription tier.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>API successfully validates and inserts a valid invoice payload.</done>
</task>

<task type="auto">
  <name>Invoice Dashboard List</name>
  <files>src/app/dashboard/invoices/page.tsx</files>
  <action>
    - Fetch user's invoices from Supabase `invoices` table using SSR.
    - Display in a shadcn `Table` component with status badges (Draft, Paid, Overdue).
    - Add a "Create Invoice" button linking to `/dashboard/invoices/new`.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Invoice list page renders cleanly and reads from Supabase.</done>
</task>

## Success Criteria
- [ ] Submitted invoices save directly to the Supabase database.
- [ ] User's dashboard list correctly displays their created invoices.
