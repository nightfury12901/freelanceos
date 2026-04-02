import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type UserRow = Database['public']['Tables']['users']['Row'];

// ── Zod Schema ────────────────────────────────────────────────────────────────

const invoiceItemSchema = z.object({
  name: z.string().min(1),
  sac: z.string().min(1),
  rate: z.number().min(0).max(28),
  amount: z.number().min(1),
});

const createInvoiceSchema = z
  .object({
    clientName: z.string().min(2),
    clientAddress: z.string().min(5),
    clientGstin: z
      .string()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN"
      )
      .optional()
      .or(z.literal("")),
    clientStateCode: z.string().min(2),
    type: z.enum(["domestic", "export"]),
    lutNumber: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.type === "export" && (!data.lutNumber || data.lutNumber.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "LUT Number is required for export invoices",
        path: ["lutNumber"],
      });
    }
  });

// ── Subscription tier invoice limits ─────────────────────────────────────────
const INVOICE_LIMITS: Record<string, number> = {
  free: 3,
  pro: Infinity,
  agency: Infinity,
};

// ── POST /api/invoices ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Enforce auth session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse & validate body
    const body = await req.json();
    const parsed = createInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // 3. Check subscription tier invoice limit (current month)
    const { data: userRow } = await supabase
      .from("users")
      .select("plan_tier")
      .eq("id", user.id)
      .single() as { data: Pick<UserRow, 'plan_tier'> | null; error: unknown };

    const tier = userRow?.plan_tier ?? "free";
    const limit = INVOICE_LIMITS[tier] ?? 3;

    if (limit !== Infinity) {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", monthStart.toISOString());

      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `Invoice limit reached. Free plan allows ${limit} invoices per month. Upgrade to Pro for unlimited invoices.`,
          },
          { status: 403 }
        );
      }
    }

    // 4. Compute totals
    const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
    const gstAmount = data.items.reduce(
      (acc, item) => acc + (item.amount * item.rate) / 100,
      0
    );
    const total = subtotal + gstAmount;

    // 5. Insert invoice into Supabase (RLS ensures user_id isolation)
    const insertPayload: InvoiceInsert = {
      user_id: user.id,
      type: data.type,
      client_name: data.clientName,
      client_gstin: data.clientGstin || null,
      items: data.items as Database['public']['Tables']['invoices']['Insert']['items'],
      total: Math.round(total * 100) / 100,
      gst_amount: Math.round(gstAmount * 100) / 100,
      lut_num: data.lutNumber || null,
    };

    const { data: invoice, error: insertError } = await supabase
      .from("invoices")
      .insert(insertPayload as any)
      .select()
      .single();

    if (insertError) {
      console.error("[invoices/POST] DB insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create invoice", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err) {
    console.error("[invoices/POST] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/invoices ─────────────────────────────────────────────────────────

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

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invoices });
  } catch (err) {
    console.error("[invoices/GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
