---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Compliance Dashboard UI

## Objective
The primary `/dashboard` route must function as the "Compliance Command Center." It gives the freelancer a top-level view of their compliance health (a computed score) and quick actions.

## Context
- `SPEC.md` outlines "Compliance dashboard shows 5 live status cards with animated score".

## Tasks

<task type="auto">
  <name>Dashboard Stats API</name>
  <files>
    src/app/api/dashboard/stats/route.ts
  </files>
  <action>
    - **GET /api/dashboard/stats**: 
      - Fetch this month's invoice count vs free limit (3).
      - Fetch total pending e-FIRAs.
      - Check `lut_filed` status from user profile.
      - Check `turnover_bracket` risk.
      - Calculate a rough "Compliance Health Score" (0-100).
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>API successfully aggregates data for the frontend.</done>
</task>

<task type="auto">
  <name>Dashboard UI Implementation</name>
  <files>
    src/app/dashboard/page.tsx
  </files>
  <action>
    - Remove placeholder loader.
    - Fetch from `/api/dashboard/stats` (or do it server-side directly in the component).
    - Render a hero section displaying the Animated Compliance Score (0-100) using framer-motion (count up animation if possible, or just a sleek circular progress).
    - Render standard bento-box cards for:
      - Quick actions (Create Invoice, Generate Contract)
      - LUT Status (Active / Needs Renewal)
      - e-FIRA Status (X Pending)
      - Monthly Invoice Usage (e-g. 2/3 Free used or Unlimited Plan Active)
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>The main dashboard provides a true "command center" feel for the User.</done>
</task>

## Success Criteria
- [ ] Dashboard displays accurate dynamic stats and a health score.
- [ ] UI is responsive and cohesive with the rest of the application.
