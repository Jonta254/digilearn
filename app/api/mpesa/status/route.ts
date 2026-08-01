import { NextRequest, NextResponse } from "next/server";
import { mpesaConfigured, stkQuery } from "@/lib/mpesa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Poll the final result of an STK Push via Daraja's STK Query API.
// Returns: "success" | "failed" | "pending".
export async function POST(req: NextRequest) {
  if (!mpesaConfigured()) {
    return NextResponse.json({ status: "failed", error: "M-Pesa isn't configured." }, { status: 503 });
  }

  let body: { checkoutRequestId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const id = String(body?.checkoutRequestId ?? "");
  if (!id) return NextResponse.json({ error: "Missing checkoutRequestId." }, { status: 400 });

  try {
    const { data } = await stkQuery(id);
    const resultCode = data?.ResultCode;

    // A final ResultCode is present once the customer has acted.
    if (resultCode !== undefined && resultCode !== null) {
      const code = String(resultCode);
      if (code === "0") {
        return NextResponse.json({ status: "success", resultDesc: data?.ResultDesc ?? "Payment received." });
      }
      // 1032 = cancelled by user, 1037 = timeout/unreachable, 1 = insufficient balance, etc.
      const reason =
        code === "1032" ? "You cancelled the request on your phone." :
        code === "1037" ? "The request timed out — no response from the phone." :
        code === "1"    ? "Payment failed (often insufficient M-Pesa balance)." :
        (data?.ResultDesc as string) || "Payment was not completed.";
      return NextResponse.json({ status: "failed", resultCode: code, resultDesc: reason });
    }

    // No ResultCode yet — Daraja is still processing (often errorCode
    // 500.001.1001, "The transaction is being processed"). Keep polling.
    return NextResponse.json({ status: "pending" });
  } catch {
    return NextResponse.json({ status: "pending" });
  }
}
