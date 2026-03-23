---
phase: 5
plan: 2
wave: 1
---

# Plan 5.2: Razorpay Integration & Webhook Sync

## Objective
Implement subscription billing via Razorpay to monetize the SaaS. The platform will enforce restrictions (Free tier limited to 3 invoices/month) and provide an upgrade path to "Pro".

## Context
- `SPEC.md` requires "Subscription gating enforced: Free tier capped at 3 invoices/mo" and "Razorpay webhook syncs subscription status".
- DB schema: `users.plan_tier` (`free` | `pro`).
- Next.js environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

## Tasks

<task type="auto">
  <name>Pricing/Upgrade Implementation</name>
  <files>
    src/app/settings/billing/page.tsx
    src/app/api/checkout/razorpay/route.ts
  </files>
  <action>
    - Create a billing settings page showing current plan and upgrade option.
    - Create `/api/checkout/razorpay` to generate Razorpay Orders dynamically when the user clicks "Subscribe".
  </action>
  <done>User can initiate a Razorpay SDK checkout flow.</done>
</task>

<task type="auto">
  <name>Razorpay Webhook Handler</name>
  <files>
    src/app/api/webhooks/razorpay/route.ts
  </files>
  <action>
    - Listen for `payment.captured` or `subscription.activated` events via POST to the webhook.
    - Verify Stripe/Razorpay signature via crypto standard (HmacSHA256).
    - Update the user's `plan_tier` to `pro` in Supabase upon successful payment.
  </action>
  <done>Webhook successfully validates and promotes user to Pro.</done>
</task>

<task type="auto">
  <name>Enforce Plan Limits</name>
  <files>
    src/app/api/invoices/route.ts
    src/app/dashboard/invoices/new/page.tsx
  </files>
  <action>
    - Update `POST /api/invoices` strictly evaluating if `user.plan_tier === 'free'` to reject if invoices constructed this month >= 3. (Already partially stubbed during Phase 2).
    - Ensure UI throws a friendly "Upgrade Required" modal/overlay if limit is hit.
  </action>
  <done>Hard enforcement blocks free abusers.</done>
</task>

## Success Criteria
- [ ] Users can trigger the Razorpay modal.
- [ ] Webhook upgrades Supabase Profile on success.
- [ ] Invoice creation is correctly blocked when hitting the free limit.
