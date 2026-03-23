import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing verification parameters" },
        { status: 400 }
      );
    }

    // Verify cryptographic signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("[Razorpay/Verify] Signature mismatch.");
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Success! Update Supabase Profile
    const { error: dbError } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .from("users")
      .update({ plan_tier: "pro" }) // Promote to Pro
      .eq("id", user.id);

    if (dbError) {
      console.error("[Razorpay/Verify] DB update failed:", dbError);
      return NextResponse.json(
        { error: "Failed to update profile to Pro" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Upgraded to Pro" });
  } catch (err) {
    console.error("[Razorpay/Verify] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
