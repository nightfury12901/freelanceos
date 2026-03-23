---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Contracts Engine (NDA, SOW, Retainer)

## Objective
Build the Contracts engine. Freelancers should be able to generate professional, standard agreements (NDA, Statement of Work, Retainer) with dynamic fields, which are then generated as PDFs and saved to their account.

## Context
- `SPEC.md`
- DB schema: `contracts` table has `template_type`, `fields_json`, `pdf_url`.
- Uses `@react-pdf/renderer` similarly to invoices.

## Tasks

<task type="auto">
  <name>Contract PDF Templates</name>
  <files>
    src/lib/pdf/contract-templates.tsx
  </files>
  <action>
    - Build `@react-pdf/renderer` templates for:
      1. **NDA** (Non-Disclosure Agreement)
      2. **SOW** (Statement of Work)
      3. **Retainer**
    - Ensure styling uses the standard serif/sans-serif fonts, professional layout, and accepts dynamic fields via props (Client Name, Effective Date, Governing Law, Compensation, etc.).
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Templates render completely and take dynamic props.</done>
</task>

<task type="auto">
  <name>Contracts API Route</name>
  <files>
    src/app/api/contracts/route.ts
    src/app/api/contracts/[id]/pdf/route.ts
  </files>
  <action>
    - **POST /api/contracts**: Create a new draft contract with JSON fields.
    - **GET /api/contracts/[id]/pdf**: Generate the PDF utilizing `contract-templates.tsx`, upload to Supabase Storage `documents`, update `pdf_url`, and return signed URL (similar to invoice generator).
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>API successfully handles contract data insertion and server-side PDF generation.</done>
</task>

<task type="auto">
  <name>Contracts UI</name>
  <files>
    src/app/dashboard/contracts/page.tsx
    src/app/dashboard/contracts/new/page.tsx
  </files>
  <action>
    - Create a Dashboard table showing generated contracts.
    - Create a dynamic form using `react-hook-form` and z.discriminatedUnion based on the `template_type` selected, ensuring correct fields are captured for the selected contract type.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Contracts dashboard UI functions intuitively and creates the documents securely.</done>
</task>

## Success Criteria
- [ ] User can select NDA, SOW, or Retainer, fill out the required dynamic text, and generate a signed PDF link instantly.
