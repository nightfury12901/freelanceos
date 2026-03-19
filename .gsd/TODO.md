# TODO.md — Pending Items

> **Project**: Freelancer Compliance OS

---

## Parking Lot (Future Phases)

- [ ] GSTN API direct integration (auto-validate GSTIN on input)
- [ ] Bulk invoice export (ZIP of PDFs)
- [ ] CA collaboration mode (share-only access)
- [ ] WhatsApp reminders via Twilio (alternative to email)
- [ ] Dark/Light mode toggle on landing page
- [ ] Multi-currency support for export invoices (USD/EUR/GBP)
- [ ] Automated GSTR-1 draft generation (Phase 6+)

## Known Risks

- [ ] Razorpay India sandbox vs production creds — must not mix
- [ ] Supabase Storage MIME check — validate server-side, not just client
- [ ] @react-pdf/renderer SSR compatibility — must mark as `server-only`
- [ ] Framer Motion + App Router — AnimatePresence must be in Client Components
