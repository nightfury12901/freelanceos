import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

type TemplateType = "nda" | "sow" | "retainer" | string;

const createContractSchema = z.object({
  template_type: z.enum(["nda", "sow", "retainer"] as const),
  fields_json: z.object({
    clientName: z.string().min(2, "Client Name must be at least 2 characters"),
    effectiveDate: z.string().min(10, "Effective date is required"),
    governingLaw: z.string().optional(),
    projectScope: z.string().optional(),
    compensation: z.string().optional(),
    duration: z.string().optional(),
  }),
});

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

    const body = await req.json();
    const parsed = createContractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { template_type, fields_json } = parsed.data;

    const { data: contract, error: dbError } = await supabase
      .from("contracts")
      .insert({
        user_id: user.id,
        template_type: template_type as TemplateType,
        fields_json: fields_json as any, // Json type bypass
      } as any)
      .select()
      .single();

    if (dbError) {
      console.error("[contracts/POST] DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to create contract" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: contract }, { status: 201 });
  } catch (err) {
    console.error("[contracts/POST] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const { data: contracts, error: dbError } = await supabase
      .from("contracts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to fetch contracts" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: contracts });
  } catch (err) {
    console.error("[contracts/GET] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
