// ── Safaricom Daraja (M-Pesa) helpers — SERVER ONLY ──────────────────────────
// No credentials are hard-coded. Everything sensitive comes from environment
// variables (see .env.example). When they're absent, `mpesaConfigured()` is
// false and the API routes return an honest "not configured" response instead
// of pretending a payment happened.
//
// Flow used by the app: STK Push to prompt the customer's phone, then poll STK
// Query for the final result. Query-based status means the app works statelessly
// on serverless (no database needed to catch the async callback).

const ENV = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
const BASE = ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

// PayBill → "CustomerPayBillOnline"; Buy Goods / Till → "CustomerBuyGoodsOnline".
const TX_TYPE = process.env.MPESA_TRANSACTION_TYPE === "CustomerBuyGoodsOnline"
  ? "CustomerBuyGoodsOnline"
  : "CustomerPayBillOnline";

export function mpesaConfigured(): boolean {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_PASSKEY &&
    process.env.MPESA_SHORTCODE,
  );
}

/** Normalise a Kenyan number to Daraja's 2547XXXXXXXX / 2541XXXXXXXX form. */
export function normalizePhone(input: string): string | null {
  let p = String(input).replace(/\D/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  else if (p.startsWith("254")) { /* already MSISDN */ }
  else if (p.startsWith("7") || p.startsWith("1")) p = "254" + p;
  return /^254(7|1)\d{8}$/.test(p) ? p : null;
}

// ── OAuth token (cached until shortly before expiry) ─────────────────────────
let tokenCache: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.exp > Date.now()) return tokenCache.token;
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
  ).toString("base64");
  const res = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data = await res.json();
  const ttl = (Number(data.expires_in) || 3599) * 1000;
  tokenCache = { token: data.access_token, exp: Date.now() + ttl - 60_000 };
  return data.access_token as string;
}

function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function passwordFor(ts: string): string {
  return Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${ts}`,
  ).toString("base64");
}

export type StkPushArgs = {
  phone: string;        // MSISDN (2547…)
  amount: number;       // KES integer
  accountRef: string;   // shows on the customer statement
  description: string;
  callbackUrl: string;
};

export type DarajaResult = { ok: boolean; status: number; data: Record<string, unknown> };

export async function stkPush(a: StkPushArgs): Promise<DarajaResult> {
  const token = await getAccessToken();
  const ts = timestamp();
  const shortcode = process.env.MPESA_SHORTCODE!;
  const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: passwordFor(ts),
      Timestamp: ts,
      TransactionType: TX_TYPE,
      Amount: Math.max(1, Math.round(a.amount)),
      PartyA: a.phone,
      PartyB: shortcode,
      PhoneNumber: a.phone,
      CallBackURL: a.callbackUrl,
      AccountReference: a.accountRef.slice(0, 12),
      TransactionDesc: a.description.slice(0, 13),
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function stkQuery(checkoutRequestId: string): Promise<DarajaResult> {
  const token = await getAccessToken();
  const ts = timestamp();
  const res = await fetch(`${BASE}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: passwordFor(ts),
      Timestamp: ts,
      CheckoutRequestID: checkoutRequestId,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
