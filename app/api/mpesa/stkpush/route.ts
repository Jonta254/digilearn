import { NextRequest, NextResponse } from "next/server";
import { mpesaConfigured, normalizePhone, stkPush } from "@/lib/mpesa";
import { COURSES } from "@/app/courses/courses";
import { COURSE_PRICE_KES } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Initiate an M-Pesa STK Push for unlocking a paid course. The amount is
// decided here on the server (never trusted from the client).
export async function POST(req: NextRequest) {
  if (!mpesaConfigured()) {
    return NextResponse.json(
      { error: "M-Pesa isn't configured on this deployment yet.", code: "not_configured" },
      { status: 503 },
    );
  }

  let body: { phone?: string; itemId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const phone = normalizePhone(String(body?.phone ?? ""));
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid Safaricom number (e.g. 0712 345 678)." }, { status: 400 });
  }

  const course = COURSES.find((c) => c.id === String(body?.itemId ?? ""));
  if (!course) return NextResponse.json({ error: "Unknown course." }, { status: 404 });
  if (course.free) return NextResponse.json({ error: "This course is free — no payment needed." }, { status: 400 });

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host");
  const callbackUrl = process.env.MPESA_CALLBACK_URL ?? `${proto}://${host}/api/mpesa/callback`;

  try {
    const { ok, data } = await stkPush({
      phone,
      amount: COURSE_PRICE_KES,
      accountRef: course.id,
      description: "DigiLearn",
      callbackUrl,
    });

    if (ok && data?.ResponseCode === "0") {
      return NextResponse.json({
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        customerMessage: data.CustomerMessage ?? "Check your phone to enter your M-Pesa PIN.",
        amount: COURSE_PRICE_KES,
      });
    }

    const message =
      (data?.errorMessage as string) ||
      (data?.ResponseDescription as string) ||
      "Could not start the M-Pesa prompt. Try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Payment service error. Please try again." }, { status: 502 });
  }
}
