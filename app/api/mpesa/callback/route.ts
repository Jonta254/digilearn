import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daraja calls this URL with the async result of an STK Push. The app confirms
// payment by polling STK Query (see /api/mpesa/status), so this endpoint only
// needs to acknowledge receipt. It's logged for debugging/reconciliation.
// If you later add a database, persist the result here for a webhook-driven flow.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cb = body?.Body?.stkCallback;
    if (cb) {
      console.log("[mpesa callback]", cb.CheckoutRequestID, "ResultCode:", cb.ResultCode, cb.ResultDesc);
    }
  } catch {
    // Ignore malformed callbacks; still acknowledge so Daraja doesn't retry.
  }
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
