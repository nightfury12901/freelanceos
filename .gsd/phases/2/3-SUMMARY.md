# Plan 2.3 Summary

- Implemented **GST Invoice PDF Generation** on the backend using `@react-pdf/renderer`.
- Created `src/lib/pdf/invoice-template.tsx` — a robust A4 template tailored for Indian GST rules:
  - Header with branding, invoice number, and date.
  - "Export — Zero-Rated (LUT)" conditional badge.
  - Bill From / Bill To sections including GSTIN fields.
  - Required legal note for LUT exports (*"Supply made under LUT — IGST not applicable"*).
  - Data table with SAC codes, individual GST calculations, and INR totals.
- Created `src/app/api/invoices/[id]/pdf/route.ts`:
  - Enforces Supabase auth and RLS to ensure users can only generate PDFs for their own invoices.
  - Caches generated PDFs — returns the existing `pdf_url` if already created.
  - Builds the PDF buffer on the server and uploads it to the Supabase Storage `documents` bucket.
  - Updates the invoice row with the `pdf_url` and returns a secure signed download link.
- Created `src/components/ui/generate-pdf-button.tsx` and integrated it into the invoices dashboard table, allowing 1-click generation and downloading of invoices.
- Configured Next.js (`next.config.ts`) to externalize `@react-pdf/renderer` for edge compatibility.
- Resolved all generic `never` TypeScript inference issues with Supabase queries.
