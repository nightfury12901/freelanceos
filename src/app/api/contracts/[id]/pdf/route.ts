import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { ContractPDFTemplate } from "@/lib/pdf/contract-templates";
import type { Database } from "@/lib/supabase/types";
import React, { type ReactElement } from "react";

type ContractRow = Database["public"]["Tables"]["contracts"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

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

    // 2. Fetch contract
    const { data: contract, error: fetchError } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as { data: ContractRow | null; error: unknown };

    if (fetchError || !contract) {
      return NextResponse.json(
        { error: "Contract not found or access denied" },
        { status: 404 }
      );
    }

    // 3. Return existing PDF if already generated
    if (contract.pdf_url) {
      return NextResponse.json({ pdf_url: contract.pdf_url });
    }

    // 4. Fetch User Details for "Freelancer Name"
    const { data: seller } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single() as { data: Pick<UserRow, "name"> | null; error: unknown };

    const freelancerName = seller?.name || user.email || "Freelancer";

    // 5. Parse Fields JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = contract.fields_json as any;

    // 6. Generate PDF Buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(ContractPDFTemplate, {
        type: contract.template_type,
        freelancerName,
        clientName: fields.clientName,
        effectiveDate: fields.effectiveDate,
        governingLaw: fields.governingLaw,
        projectScope: fields.projectScope,
        compensation: fields.compensation,
        duration: fields.duration,
      }) as ReactElement<DocumentProps>
    );

    // 7. Upload to Supabase Storage
    const filename = `${user.id}/contracts/${contract.template_type}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("documents") // Reusing the documents bucket
      .upload(filename, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[contracts/pdf] Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload PDF", details: uploadError.message },
        { status: 500 }
      );
    }

    // 8. Sign URL
    const { data: signedData, error: signError } = await supabase.storage
      .from("documents")
      .createSignedUrl(filename, 3600);

    const pdfUrl = signedData?.signedUrl ?? filename;

    // 9. Patch Contract with pdf_url
    await supabase
      .from("contracts")
      .update({ pdf_url: pdfUrl } as never)
      .eq("id", contract.id)
      .eq("user_id", user.id);

    return NextResponse.json({ pdf_url: pdfUrl });
  } catch (err) {
    console.error("[contracts/pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
