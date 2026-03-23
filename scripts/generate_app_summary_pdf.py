from __future__ import annotations

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Frame, KeepInFrame, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
OUTPUT_FILE = OUTPUT_DIR / "freelanceos-app-summary.pdf"


def make_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=25,
            textColor=colors.HexColor("#0F172A"),
            spaceAfter=5,
        ),
        "sub": ParagraphStyle(
            "Sub",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=10.5,
            textColor=colors.HexColor("#475569"),
            spaceAfter=8,
        ),
        "h": ParagraphStyle(
            "Heading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=12,
            textColor=colors.HexColor("#0B5D3B"),
            spaceBefore=2,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.6,
            leading=10.6,
            textColor=colors.HexColor("#111827"),
            spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.3,
            leading=9.9,
            textColor=colors.HexColor("#111827"),
            leftIndent=10,
            firstLineIndent=-6,
            bulletIndent=0,
            spaceAfter=2,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.8,
            leading=9.2,
            textColor=colors.HexColor("#334155"),
            spaceAfter=2,
        ),
    }


def section_heading(text: str, styles: dict[str, ParagraphStyle]):
    return Paragraph(text, styles["h"])


def bullet(text: str, styles: dict[str, ParagraphStyle]):
    return Paragraph(text, styles["bullet"], bulletText="-")


def build_story():
    s = make_styles()
    left = [
        Paragraph("FreelanceOS", s["title"]),
        Paragraph(
            "Repo summary generated from code and migration evidence only. "
            "Stack appears to be Next.js App Router + Supabase with server-side PDF generation.",
            s["sub"],
        ),
        section_heading("What It Is", s),
        Paragraph(
            "A compliance-focused web app for Indian freelancers that centralizes GST invoicing, export compliance tracking, contracts, and subscription billing. "
            "The product positions itself as a way to reduce GST mistakes and keep freelance operations organized.",
            s["body"],
        ),
        section_heading("Who It's For", s),
        Paragraph(
            "Primary persona: Indian freelancers and consultants, especially those issuing domestic/export invoices and managing LUT and e-FIRA paperwork.",
            s["body"],
        ),
        section_heading("What It Does", s),
        bullet("Creates domestic and export invoices with validation, GST totals, and PDF generation.", s),
        bullet("Tracks compliance health from GSTIN, LUT status, invoice activity, and pending e-FIRAs.", s),
        bullet("Stores and lists freelancer contracts (NDA, SOW, retainer) and renders contract PDFs.", s),
        bullet("Uploads e-FIRA PDFs and links them to export invoices for audit tracking.", s),
        bullet("Provides authenticated dashboard, invoice table, contracts table, and billing screens.", s),
        bullet("Supports free vs pro plan gating, including invoice limits and Razorpay upgrade flow.", s),
        bullet("Includes landing/marketing pages for features, pricing, testimonials, and signup.", s),
    ]

    right = [
        section_heading("How It Works", s),
        bullet("UI: Next.js App Router pages under `src/app` with landing, auth, dashboard, invoices, contracts, EFIRA, and billing views.", s),
        bullet("Auth/session: Supabase SSR client + middleware refresh cookies, guard `/dashboard`, and redirect signed-in users away from auth pages.", s),
        bullet("API layer: route handlers validate input with Zod, read/write Supabase tables, and return JSON for invoices, contracts, EFIRA, stats, and checkout.", s),
        bullet("Data: Supabase Postgres tables include `users`, `invoices`, `contracts`, `documents`, and `reminders`, protected by row-level security.", s),
        bullet("Files/PDFs: invoice and contract routes render PDFs with `@react-pdf/renderer`, upload them to Supabase Storage, and save signed URLs/paths.", s),
        bullet("Billing: client-side Razorpay checkout loads the SDK, creates an order server-side, verifies the signature, then updates `users.plan_tier`.", s),
        section_heading("How To Run", s),
        bullet("Install dependencies: `npm install`.", s),
        bullet("Set env vars from `.env.example` in `.env.local` at minimum for Supabase; billing/email flows also expect Razorpay and Resend keys.", s),
        bullet("Apply SQL in `supabase/migrations/001_initial_schema.sql`, `002_rls_policies.sql`, and `003_storage.sql` using Supabase Studio or CLI.", s),
        bullet("Start locally with `npm run dev`, then open `http://localhost:3000`.", s),
        section_heading("Not Found In Repo", s),
        Paragraph(
            "Production deployment instructions, seeded demo credentials, automated reminder worker implementation, and a canonical README/getting-started guide were not found in repo.",
            s["small"],
        ),
    ]

    return s, left, right


def draw_header_footer(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D1D5DB"))
    canvas.setLineWidth(0.7)
    canvas.line(16 * mm, height - 18 * mm, width - 16 * mm, height - 18 * mm)
    canvas.line(16 * mm, 16 * mm, width - 16 * mm, 16 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor("#64748B"))
    canvas.drawString(16 * mm, 10 * mm, "Generated from repository evidence on 2026-03-22")
    canvas.drawRightString(width - 16 * mm, 10 * mm, "1 page")
    canvas.restoreState()


def generate():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT_FILE),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=22 * mm,
        bottomMargin=20 * mm,
    )

    styles, left_story, right_story = build_story()
    gutter = 8 * mm
    frame_width = (doc.width - gutter) / 2
    frame_height = doc.height

    left_box = KeepInFrame(frame_width, frame_height, left_story, mode="shrink")
    right_box = KeepInFrame(frame_width, frame_height, right_story, mode="shrink")

    def on_page(canvas, current_doc):
        draw_header_footer(canvas, current_doc)
        y = current_doc.bottomMargin
        left_frame = Frame(
            current_doc.leftMargin,
            y,
            frame_width,
            frame_height,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
            showBoundary=0,
        )
        right_frame = Frame(
            current_doc.leftMargin + frame_width + gutter,
            y,
            frame_width,
            frame_height,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
            showBoundary=0,
        )
        left_frame.addFromList([left_box], canvas)
        right_frame.addFromList([right_box], canvas)

    doc.build([Spacer(1, 1)], onFirstPage=on_page, onLaterPages=on_page)
    return OUTPUT_FILE


if __name__ == "__main__":
    path = generate()
    print(path)
