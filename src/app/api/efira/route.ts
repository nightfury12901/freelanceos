import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export type EfiraStatusResponse = InvoiceRow & {
  efira_document: DocumentRow | null;
};

// ── GET /api/efira ─────────────────────────────────────────────────────────

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all export invoices for the user
    const { data: exportInvoices, error: invError } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "export")
      .order("created_at", { ascending: false });

    if (invError) {
      return NextResponse.json({ error: invError.message }, { status: 500 });
    }

    // Fetch all e-FIRA documents for the user
    const { data: efiraDocs, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .eq("doc_type", "efira");

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 500 });
    }

    // Map documents to their invoices
    const invoicesList = (exportInvoices as unknown as InvoiceRow[]) || [];
    const docsList = (efiraDocs as unknown as DocumentRow[]) || [];
    
    const mapped: EfiraStatusResponse[] = invoicesList.map((inv) => {
      const doc = docsList.find((d) => d.invoice_id === inv.id) || null;
      return { ...inv, efira_document: doc };
    });

    return NextResponse.json({ data: mapped });
  } catch (err) {
    console.error("[efira/GET] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── POST /api/efira ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse formData (multipart/form-data)
    const formData = await req.formData();
    const invoiceId = formData.get("invoiceId") as string;
    const file = formData.get("file") as File;

    if (!invoiceId || !file) {
      return NextResponse.json(
        { error: "Missing invoiceId or file" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed for e-FIRA" },
        { status: 400 }
      );
    }
    
    // Verify invoice belongs to user and is an export
    const { data: invoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .eq("type", "export")
      .single();

    if (!invoice) {
      return NextResponse.json(
        { error: "Invalid invoice or unauthorized" },
        { status: 404 }
      );
    }

    // Check if e-FIRA already exists
    const { data: existingDoc } = await supabase
      .from("documents")
      .select("id")
      .eq("invoice_id", invoiceId)
      .eq("doc_type", "efira")
      .maybeSingle();

    if (existingDoc) {
      return NextResponse.json(
        { error: "e-FIRA already uploaded for this invoice" },
        { status: 409 }
      );
    }

    // Upload to Storage
    const ext = file.name.split(".").pop();
    const filename = `${user.id}/efira/${invoiceId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[efira/POST] Storage error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Get public URL (documents bucket is private, but we use a signed URL strategy later, 
    // or store the path and fetch signed URLs on the fly. We'll store the path.)
    // Signed URL is generated on-demand; we store the storage path in file_url

    // Insert to DB
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        invoice_id: invoiceId,
        doc_type: "efira",
        file_url: filename,
      } as any)
      .select()
      .single();

    if (dbError) {
      console.error("[efira/POST] DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to record document in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (err) {
    console.error("[efira/POST] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
