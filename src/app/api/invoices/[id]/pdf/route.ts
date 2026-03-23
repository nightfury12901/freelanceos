/**
 * GET /api/invoices/[id]/pdf
 *
 * Generates a GST Tax Invoice PDF for the given invoice ID.
 * - Fetches invoice + user (seller) data from Supabase
 * - Builds a @react-pdf/renderer document on the server
 * - Uploads to Supabase Storage `documents` bucket
 * - Patches `pdf_url` on the invoice row
 * - Returns the signed URL for immediate download
 */
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { InvoicePDFTemplate } from "@/lib/pdf/invoice-template";
import type { Database } from "@/lib/supabase/types";
import React, { type ReactElement } from "react";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

// Generate a sequential-looking invoice number from UUID + date
function buildInvoiceNumber(id: string, createdAt: string): string {
  const date = new Date(createdAt);
  const fy = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  const fyShort = `${String(fy).slice(-2)}-${String(fy + 1).slice(-2)}`;
  const seq = id.slice(-6).toUpperCase();
  return `INV-${fyShort}-${seq}`;
}

function formatPDFDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch invoice (RLS enforces user_id ownership)
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as { data: InvoiceRow | null; error: unknown };

    if (fetchError || !invoice) {
      return NextResponse.json(
        { error: "Invoice not found or access denied" },
        { status: 404 }
      );
    }

    // 3. Return existing PDF if already generated
    if (invoice.pdf_url) {
      return NextResponse.json({ pdf_url: invoice.pdf_url });
    }

    // 4. Fetch seller (user profile) details
    const { data: seller } = await supabase
      .from("users")
      .select("name, gstin")
      .eq("id", user.id)
      .single() as { data: Pick<UserRow, "name" | "gstin"> | null; error: unknown };

    const sellerName = seller?.name ?? user.email ?? "Freelancer";
    const sellerGstin = seller?.gstin ?? "N/A";

    // 5. Parse items from the JSON column
    const rawItems = invoice.items as Array<{
      name: string;
      sac: string;
      rate: number;
      amount: number;
    }>;

    const subtotal = rawItems.reduce((acc, item) => acc + item.amount, 0);
    const gstAmount = invoice.gst_amount;
    const total = invoice.total;

    // 6. Generate PDF buffer using @react-pdf/renderer
    const invoiceNumber = buildInvoiceNumber(invoice.id, invoice.created_at);
    const invoiceDate = formatPDFDate(invoice.created_at);

    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePDFTemplate, {
        invoiceNumber,
        invoiceDate,
        sellerName,
        sellerGstin,
        sellerAddress: "India",
        clientName: invoice.client_name,
        clientGstin: invoice.client_gstin,
        clientAddress: "India",
        clientStateCode: "00",
        type: invoice.type,
        lutNumber: invoice.lut_num,
        items: rawItems,
        subtotal,
        gstAmount,
        total,
      }) as ReactElement<DocumentProps>
    );

    // 7. Upload to Supabase Storage `documents` bucket
    const filename = `${user.id}/${invoiceNumber}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filename, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("[pdf/GET] Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "PDF uploaded failed", details: uploadError.message },
        { status: 500 }
      );
    }

    // 8. Get a signed URL (valid 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(filename, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      return NextResponse.json(
        { error: "Could not generate download URL" },
        { status: 500 }
      );
    }

    const pdfUrl = signedUrlData.signedUrl;

    // 9. Patch invoice row with pdf_url
    await (supabase as ReturnType<typeof createClient> extends Promise<infer C> ? C : never extends never ? typeof supabase : typeof supabase)
      .from("invoices")
      .update({ pdf_url: pdfUrl } as never)
      .eq("id", id)
      .eq("user_id", user.id);

    return NextResponse.json({ pdf_url: pdfUrl });
  } catch (err) {
    console.error("[pdf/GET] Unexpected error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ error: "Internal server error", details: errorMessage, stack: errorStack }, { status: 500 });
  }
}

