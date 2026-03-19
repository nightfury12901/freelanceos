---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Invoice Constants & Form UI

## Objective
Build the foundation for the Invoice Engine by defining necessary constants (SAC codes, tax rates) and creating the complex Invoice Creation form with Zod validation and domestic/export toggling.

## Context
- .gsd/SPEC.md
- src/lib/constants.ts
- src/app/dashboard/invoices/new/page.tsx

## Tasks

<task type="auto">
  <name>Invoice Constants</name>
  <files>src/lib/constants.ts</files>
  <action>
    - Export lists for SAC codes (common freelancer services like software dev, consulting), GST rate options (0%, 18%), and Indian State codes for IGST/CGST calculation.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>constants.ts contains robust types and arrays for invoice dropdowns.</done>
</task>

<task type="auto">
  <name>Invoice Form Layout</name>
  <files>src/app/dashboard/invoices/new/page.tsx</files>
  <action>
    - Build a comprehensive form using react-hook-form + Zod + shadcn `Form`.
    - Fields: Client Name, GSTIN, Address, Item rows (Name, SAC, Rate, Amount), Type toggle (Domestic vs Export/LUT).
    - Use Framer Motion to conditionally reveal LUT fields if type is 'Export'.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Form UI renders without type errors and supports adding dynamic item rows.</done>
</task>

## Success Criteria
- [ ] Constants logic handles Indian tax scenarios.
- [ ] Form strictly validates inputs via Zod before allowing submission.
