---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: e-FIRA Tracker UI & API

## Objective
Build the e-FIRA tracker. Users need a place to see all foreign/export invoices that don't yet have an e-FIRA document uploaded. They should be able to upload the PDF evidence and see the status change.

## Context
- `SPEC.md`
- DB schema: `documents` table has `doc_type: 'efira'` linked to `invoice_id`.

## Tasks

<task type="auto">
  <name>e-FIRA API Routes</name>
  <files>
    src/app/api/efira/route.ts
    src/app/api/efira/[id]/route.ts
  </files>
  <action>
    - **GET /api/efira**: Fetch all `export` invoices. For each, check if a document exists in `documents` where `doc_type = 'efira'`.
    - **POST /api/efira**: Accept an invoice ID and a base64/FormData PDF.
      - Enforce Auth.
      - Upload the file to `documents` bucket under `efira/`.
      - Insert a row into the Postgres `documents` table linking to the `invoice_id`.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>API successfully handles fetching missing e-FIRAs and uploading new ones.</done>
</task>

<task type="auto">
  <name>e-FIRA Dashboard View</name>
  <files>
    src/app/dashboard/efira/page.tsx
    src/components/dashboard/efira-upload.tsx
  </files>
  <action>
    - Create a dashboard page that fetches the e-FIRA status list (SSR).
    - Display two tabs/sections: **Pending e-FIRA** and **Completed**.
    - For pending, show a "Upload Document" button that opens an upload modal.
    - Implement `efira-upload.tsx` Client Component using `<input type="file" accept=".pdf">` and `fetch('/api/efira', { method: 'POST' })`.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>UI renders the split view and successfully handles PDF uploads.</done>
</task>

## Success Criteria
- [ ] Export invoices correctly identify whether they are missing an e-FIRA.
- [ ] User can successfully upload a PDF file that saves to Supabase Storage and updates the tracking table.
