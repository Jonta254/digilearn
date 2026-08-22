import { readLocalValue, writeLocalValue } from "./learning-storage";

export const ACCOUNTS_KEY = "digilearn_accounts";
export const SESSION_KEY = "digilearn_user";
const MAX_ACCOUNTS = 50;
const ITERATIONS = 120_000;

export type Credential = { version: 1; salt: string; hash: string; iterations: number };
export type LocalAccount = {
  id: string; name: string; email: string; joinedAt: string; plan: "free" | "pro";
  coursesEnrolled: string[]; progress: Record<string, number>; streak: number; hoursLearned: number;
  password?: string; credential?: Credential;
};
export type LocalSession = Omit<LocalAccount, "password" | "credential">;

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}
function safeText(value: unknown, max: number) { return typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max) : ""; }
function safeIds(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && /^[a-z0-9][a-z0-9-]{0,127}$/.test(item)).slice(0, 100) : []; }
function bytesToBase64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)); }
function base64ToBytes(value: string) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }

export function parseLocalAccount(value: unknown): LocalAccount | undefined {
  const item = record(value);
  if (!item) return undefined;
  const id = safeText(item.id, 100), name = safeText(item.name, 100), email = safeText(item.email, 254).toLowerCase();
  if (!id || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined;
  const credentialValue = record(item.credential);
  const credential = credentialValue && credentialValue.version === 1 && typeof credentialValue.salt === "string" && typeof credentialValue.hash === "string" && typeof credentialValue.iterations === "number"
    ? { version: 1 as const, salt: credentialValue.salt.slice(0, 100), hash: credentialValue.hash.slice(0, 200), iterations: Math.min(Math.max(Math.trunc(credentialValue.iterations), 100_000), 500_000) }
    : undefined;
  const rawProgress = record(item.progress) ?? {};
  const progress = Object.fromEntries(Object.entries(rawProgress).filter(([key, amount]) => /^[a-z0-9-]{1,128}$/.test(key) && typeof amount === "number" && Number.isFinite(amount)).slice(0, 100).map(([key, amount]) => [key, Math.min(100, Math.max(0, amount as number))]));
  return {
    id, name, email, joinedAt: typeof item.joinedAt === "string" && Number.isFinite(Date.parse(item.joinedAt)) ? item.joinedAt : new Date(0).toISOString(),
    plan: item.plan === "pro" ? "pro" : "free", coursesEnrolled: safeIds(item.coursesEnrolled), progress,
    streak: typeof item.streak === "number" && Number.isFinite(item.streak) ? Math.max(0, Math.trunc(item.streak)) : 0,
    hoursLearned: typeof item.hoursLearned === "number" && Number.isFinite(item.hoursLearned) ? Math.max(0, item.hoursLearned) : 0,
    password: typeof item.password === "string" ? item.password.slice(0, 500) : undefined,
    credential,
  };
}

export function loadAccounts(): LocalAccount[] {
  try {
    const value = JSON.parse(readLocalValue(ACCOUNTS_KEY) || "[]");
    return Array.isArray(value) ? value.slice(0, MAX_ACCOUNTS).map(parseLocalAccount).filter((item): item is LocalAccount => Boolean(item)) : [];
  } catch { return []; }
}
export function saveAccounts(accounts: LocalAccount[]) { return writeLocalValue(ACCOUNTS_KEY, JSON.stringify(accounts.slice(0, MAX_ACCOUNTS))); }
export function toSession(account: LocalAccount): LocalSession {
  return { id: account.id, name: account.name, email: account.email, joinedAt: account.joinedAt, plan: account.plan, coursesEnrolled: account.coursesEnrolled, progress: account.progress, streak: account.streak, hoursLearned: account.hoursLearned };
}
export function saveSession(account: LocalAccount) { return writeLocalValue(SESSION_KEY, JSON.stringify(toSession(account))); }

export async function createCredential(password: string): Promise<Credential> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, material, 256);
  return { version: 1, salt: bytesToBase64(salt), hash: bytesToBase64(new Uint8Array(bits)), iterations: ITERATIONS };
}
export async function verifyCredential(password: string, credential: Credential): Promise<boolean> {
  try {
    const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: base64ToBytes(credential.salt), iterations: credential.iterations }, material, 256));
    const expected = base64ToBytes(credential.hash);
    if (bits.length !== expected.length) return false;
    let difference = 0;
    for (let index = 0; index < bits.length; index++) difference |= bits[index] ^ expected[index];
    return difference === 0;
  } catch { return false; }
}
export function verifyLegacyPassword(password: string, encoded: string | undefined) {
  try { return Boolean(encoded) && encoded === btoa(password); } catch { return false; }
}
