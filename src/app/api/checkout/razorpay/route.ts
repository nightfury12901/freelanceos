import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("plan_tier")
      .eq("id", user.id)
      .single() as { data: any; error: any };

    if (profile?.plan_tier === "pro") {
      return NextResponse.json(
        { error: "Already subscribed to Pro" },
        { status: 400 }
      );
    }

    // Razorpay standard setup
    const amount = 999 * 100; // Rs 999 in paise
    const currency = "INR";
    const receipt = `rcpt_${user.id}_${Date.now()}`;

    // Raw implementation to avoid razorpay npm package dependency
    const basicAuth = Buffer.from(
      `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
      }),
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.text();
      console.error("[Razorpay/Order] Failed:", errorData);
      throw new Error("Failed to create Razorpay order");
    }

    const order = await orderRes.json();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("[Razorpay/POST]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
