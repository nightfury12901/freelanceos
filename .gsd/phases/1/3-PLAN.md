---
phase: 1
plan: 3
wave: 2
---

# Plan 1.3: Landing Page — Hero + Features + Pricing + Footer

## Objective
Build the complete public landing page (`/`) with: kinetic text hero section (basement.studio inspired), 6 bento feature cards (Aceternity 3D hover), pricing toggle (monthly/yearly with AnimatePresence), testimonials carousel, and footer with Razorpay payment CTA. This is the conversion engine of the product.

## Context
- `.gsd/SPEC.md` — UI system (Navy + Teal + glassmorphism), pricing (₹299/₹499/mo, ₹1999/yr)
- `lib/animations.ts` — reusable variants (from Plan 1.2)
- `lib/constants.ts` — plan details (from Plan 1.2)
- `.gsd/DECISIONS.md` — ADR-001 (Server Components), ADR-005 (no any)

## Tasks

<task type="auto">
  <name>Landing Page — Hero + Features Bento Grid</name>
  <files>
    app/page.tsx
    app/layout.tsx
    components/landing/hero.tsx
    components/landing/features.tsx
    components/landing/navbar.tsx
    public/fonts/ (if custom fonts needed)
  </files>
  <action>
    1. Update `app/layout.tsx`:
       - Import `Inter` + `DM Sans` from `next/font/google`
       - Apply as CSS variables: `--font-inter`, `--font-dm-sans`
       - Meta: title "FreelanceOS — GST Compliance for Indian Freelancers", description, OG tags
       - Background: `bg-[#0f172a]` (Navy), text-white default

    2. Create `components/landing/navbar.tsx` — Client Component:
       - Floating navbar: `fixed top-4 left-4 right-4 z-50`
       - Glassmorphism: `bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-3`
       - Logo left: "FreelanceOS" in teal
       - Links right: Features, Pricing, Sign In
       - CTA button: "Get Started" (teal, rounded-xl)
       - Framer Motion: fade-in from top on mount (300ms)

    3. Create `components/landing/hero.tsx` — Client Component:
       - Headline: kinetic stagger animation — each word animates in with `y: 60 → 0, opacity: 0 → 1` staggered by 0.08s
       - Headline text: "Your GST Compliance, Sorted."
       - Sub-headline: "Invoices. Contracts. GSTR-1. e-FIRA. All in one place, ₹299/mo."
       - CTA button: `bg-teal-500` with glow shadow `shadow-[0_0_30px_rgba(20,184,166,0.4)]`, text "Start Free Trial"
       - Animated badge above headline: "🇮🇳 Built for Indian Freelancers" (pill shape, teal border)
       - Background: subtle radial gradient from `#14b8a6/10` at center

    4. Create `components/landing/features.tsx` — Client Component:
       - 6 bento cards in CSS grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
       - Cards: "GST Invoicing", "Export + LUT", "e-FIRA Tracker", "Compliance Dashboard", "Contracts", "GSTR-1 Reminders"
       - Each card: glassmorphism (`bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6`)
       - 3D hover lift: `whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(20,184,166,0.15)' }}`
       - Entrance: `staggerChildren` — cards reveal bottom-to-top with 0.1s stagger
       - Icon: Lucide icon (20px, teal color) per card
       - Title: 16px semibold white, Description: 14px text-slate-400

    5. Create `app/page.tsx` — Server Component:
       - Compose: `<Navbar />`, `<Hero />`, `<Features />`, `<Pricing />` (from Plan 1.3 task 2), `<Footer />`
       - No padding/margin at root — sections self-contain spacing

    **Avoid:**
    - Do NOT use emoji as icons in features grid (use Lucide SVG icons)
    - Do NOT use `scale()` CSS transform for hover — causes layout shift: use `y` translation only
    - Do NOT use placeholder images — all visual elements are CSS/SVG only
  </action>
  <verify>
    1. `npm run dev` → visit `http://localhost:3000` — all 3 sections visible
    2. Hero headline animates in on load (kinetic stagger)
    3. Feature cards have 3D hover effect (verify in browser)
    4. No horizontal scroll on mobile (375px viewport)
    5. Lighthouse Performance score ≥ 85 on `/`
  </verify>
  <done>
    - Landing page renders at `/` with Navbar, Hero, and Features sections
    - Kinetic hero text stagger animation works
    - 6 feature cards with hover lift effect
    - Mobile responsive (no horizontal scroll at 375px)
    - No console errors
  </done>
</task>

<task type="auto">
  <name>Landing Page — Pricing Toggle + Testimonials + Footer</name>
  <files>
    components/landing/pricing.tsx
    components/landing/testimonials.tsx
    components/landing/footer.tsx
  </files>
  <action>
    1. Create `components/landing/pricing.tsx` — Client Component:
       - Toggle: "Monthly / Yearly" using shadcn `ToggleGroup`
       - AnimatePresence: price number slides up/down when toggling (old price exits up, new price enters from below)
       - 3 plan cards:
         * Free: ₹0/mo — 3 invoices/mo, basic features, teal border on bottom only
         * Pro: ₹299/mo (₹249/mo if yearly) — unlimited invoices, all features, teal glow card (featured)
         * Agency: ₹499/mo (₹399/mo if yearly) — all Pro + priority support
       - "Get Started" button on each: links to `/auth/register?plan={plan}`
       - Featured Pro card: `border-teal-500 shadow-[0_0_40px_rgba(20,184,166,0.2)]`
       - Yearly badge on toggle: "Save 17%" in teal pill

    2. Create `components/landing/testimonials.tsx` — Client Component:
       - Horizontal auto-scrolling carousel (CSS marquee technique or Framer Motion `x` animation)
       - 6 testimonial cards, duplicated for infinite loop
       - Each card: glassmorphism, avatar initials (colored circle), name, role, quote text
       - Sample testimonials (realistic Indian freelancer names + use cases)
       - Speed: 30s for full loop, pause on hover

    3. Create `components/landing/footer.tsx` — Server Component:
       - 4 columns: Product, Legal, Resources, Connect
       - Bottom bar: "© 2024 FreelanceOS. Made in India 🇮🇳" + "Privacy" + "Terms"
       - Social icons: Twitter/X, LinkedIn, GitHub (Lucide or Simple Icons SVG)
       - Top of footer: Final CTA section — "Ready to sort your compliance?" + big "Start Free — ₹0" button

    **Styling rules across all 3 components:**
    - Section padding: `py-24 px-4`
    - Max width container: `max-w-6xl mx-auto`
    - Section heading: 36px bold white with teal word highlight
    - `prefers-reduced-motion`: wrap all Framer Motion animations with `useReducedMotion()` check

    **Avoid:**
    - Do NOT use `position: fixed` for testimonials carousel — use `overflow: hidden` container with animated inner track
    - Do NOT hardcode prices in JSX — import from `lib/constants.ts SUBSCRIPTION_PLANS`
  </action>
  <verify>
    1. Toggle monthly/yearly — price AnimatePresence animation plays
    2. Testimonials carousel auto-scrolls, pauses on hover
    3. "Get Started" on pricing redirects to `/auth/register?plan=pro` etc.
    4. Footer renders all 4 columns with correct links
    5. Check `prefers-reduced-motion` in Chrome devtools — animations should disable
  </verify>
  <done>
    - Pricing toggle works with animated price swap
    - Testimonials carousel auto-scrolls infinitely
    - Footer renders with 4 columns and final CTA
    - All links in footer are non-broken (can be `#` for now except auth links)
    - `prefers-reduced-motion` respected
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Visual QA — Landing Page Full Review</name>
  <action>
    User opens `http://localhost:3000` and checks:
    1. Hero kinetic text animation plays on load
    2. Feature cards have 3D hover lift (move mouse over cards)
    3. Pricing toggle animates correctly between monthly and yearly
    4. Testimonials carousel scrolls automatically
    5. Footer links are visible and properly spaced
    6. Resize to 375px width — no horizontal scroll, layout stacks correctly
    7. Overall visual feel matches Navy + Teal glassmorphism aesthetic
  </action>
  <done>User confirms landing page looks premium and matches the design brief.</done>
</task>

## Success Criteria
- [ ] Landing page renders all 4 sections: Hero, Features (6 cards), Pricing (3 plans + toggle), Testimonials, Footer
- [ ] Hero kinetic stagger animation plays on page load
- [ ] Pricing toggle switches monthly/yearly with AnimatePresence price animation
- [ ] Testimonials carousel auto-scrolls
- [ ] Mobile responsive at 375px (no horizontal scroll)
- [ ] `prefers-reduced-motion` disables all animations
- [ ] 0 TypeScript errors, 0 console errors in browser
