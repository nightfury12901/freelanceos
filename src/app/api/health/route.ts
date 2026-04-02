import { type NextRequest, NextResponse } from "next/server";

export function GET(_request: NextRequest) {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
