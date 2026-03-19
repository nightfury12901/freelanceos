---
phase: 2
plan: 3
wave: 2
---

# Plan 2.3: PDF Generation & Download

## Objective
Generate a highly accurate GST PDF document from the invoice data on the server utilizing `@react-pdf/renderer` and upload it to Supabase storage.

## Context
- .gsd/SPEC.md
- src/app/api/invoices/[id]/pdf/route.ts

## Tasks

<task type="auto">
  <name>PDF Generator Service</name>
  <files>src/app/api/invoices/[id]/pdf/route.ts</files>
  <action>
    - Retrieve invoice row by ID from Supabase (verify user ownership via RLS/session).
    - Use `@react-pdf/renderer/renderToStream` on the backend to generate a PDF buffer.
    - Upload buffer to Supabase storage `documents` bucket.
    - Attach the `pdf_url` back to the invoice row.
    - Return the signed URL for instant download to the client.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>API successfully generates a PDF buffer and uploads it to storage without client-side rendering issues.</done>
</task>

## Success Criteria
- [ ] Next.js API generates a PDF using React-PDF without webpack/browser errors.
- [ ] Client can download the generated invoice PDF securely.
