import { readLocalValue, writeLocalValue } from "./learning-storage";

export const ACCOUNTS_KEY = "digilearn_accounts";
export const SESSION_KEY = "digilearn_user";
const MAX_PROFILES = 20;

export type LocalProfile = { id: string; name: string; joinedAt: string };
export type LocalAccount = LocalProfile;
export type LocalSession = LocalProfile;

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}
function safeText(value: unknown, max: number) { return typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max) : ""; }

// Old account records are intentionally reduced to non-sensitive profile fields.
export function parseLocalAccount(value: unknown): LocalProfile | undefined {
  const item = record(value);
  if (!item) return undefined;
  const id = safeText(item.id, 100), name = safeText(item.name, 100);
  if (!id || !name) return undefined;
  return { id, name, joinedAt: typeof item.joinedAt === "string" && Number.isFinite(Date.parse(item.joinedAt)) ? item.joinedAt : new Date(0).toISOString() };
}
export function loadAccounts(): LocalProfile[] {
  try { const value = JSON.parse(readLocalValue(ACCOUNTS_KEY) || "[]"); return Array.isArray(value) ? value.slice(0, MAX_PROFILES).map(parseLocalAccount).filter((item): item is LocalProfile => Boolean(item)) : []; }
  catch { return []; }
}
export function saveAccounts(profiles: LocalProfile[]) { return writeLocalValue(ACCOUNTS_KEY, JSON.stringify(profiles.slice(0, MAX_PROFILES))); }
export function toSession(profile: LocalProfile): LocalSession { return { ...profile }; }
export function saveSession(profile: LocalProfile) { return writeLocalValue(SESSION_KEY, JSON.stringify(toSession(profile))); }
