# Plan 1 Summary

- Updated `lib/constants.ts` with Indian GST States, SAC Codes, and GST Rates.
- Built complex `NewInvoicePage` in `app/dashboard/invoices/new/page.tsx` using Zod for strict GSTIN/Export validation, `react-hook-form` `useFieldArray` for dynamic line items, and Framer Motion for conditional LUT field reveals.
- Installed required shadcn components (`form`, `select`, `table`, `badge`) and `react-hook-form` + `@hookform/resolvers/zod`.
