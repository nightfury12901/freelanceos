import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // 1. Fetch user profile
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single() as { data: any; error: any };

    // 2. Fetch current month's invoices
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: recentInvoices } = await supabase
      .from("invoices")
      .select("id, type")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    const invoicesThisMonth = recentInvoices?.length || 0;

    // 3. Check for pending e-FIRAs
    //   An export invoice without a corresponding 'efira' document
    const { data: exportInvoicesRaw } = await supabase
      .from("invoices")
      .select("id")
      .eq("user_id", user.id)
      .eq("type", "export");

    const { data: efiraDocsRaw } = await supabase
      .from("documents")
      .select("invoice_id")
      .eq("user_id", user.id)
      .eq("doc_type", "efira");

    const exportInvoices = (exportInvoicesRaw as any[]) || [];
    const efiraDocs = (efiraDocsRaw as any[]) || [];

    const efiraInvoiceIds = new Set(efiraDocs.map((d) => d.invoice_id));
    const pendingEfiras = exportInvoices.filter(
      (inv) => !efiraInvoiceIds.has(inv.id)
    ).length;

    // 4. Calculate Compliance Health Score (0 - 100)
    let score = 100;

    // LUT active gives points if they have export turnover
    if (!profile?.lut_filed && exportInvoices?.length) {
      score -= 30; // High penalty for exporting without LUT
    }

    // Pending e-FIRAs drop the score
    if (pendingEfiras > 0) {
      score -= pendingEfiras * 10;
    }

    // No GSTIN setup drops the score
    if (!profile?.gstin) {
      score -= 20;
    }

    score = Math.max(0, score); // Floor at 0

    return NextResponse.json({
      data: {
        score,
        invoicesThisMonth,
        planTier: profile?.plan_tier || "free",
        lutFiled: profile?.lut_filed || false,
        pendingEfiras,
        hasGstin: !!profile?.gstin,
      },
    });
  } catch (err) {
    console.error("[stats/GET] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
