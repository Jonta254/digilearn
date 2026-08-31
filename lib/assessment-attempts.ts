export const ASSESSMENT_KEY = "digilearn_assessments_v1";
const MAX_ATTEMPTS = 200;
const MAX_RAW_LENGTH = 500_000;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,160}$/;
export type Attempt = { assessmentId: string; courseId: string; score: number; passed: boolean; completedAt: string };
export function parseAttempts(raw: string | null): Attempt[] {
  if (!raw || raw.length > MAX_RAW_LENGTH) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.slice(-MAX_ATTEMPTS).flatMap((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
      const item = entry as Record<string, unknown>;
      if (!SAFE_ID.test(String(item.assessmentId ?? "")) || !SAFE_ID.test(String(item.courseId ?? ""))) return [];
      if (typeof item.score !== "number" || !Number.isInteger(item.score) || item.score < 0 || item.score > 100) return [];
      if (typeof item.passed !== "boolean" || typeof item.completedAt !== "string" || !Number.isFinite(Date.parse(item.completedAt))) return [];
      return [{ assessmentId: item.assessmentId as string, courseId: item.courseId as string, score: item.score, passed: item.passed, completedAt: item.completedAt }];
    });
  } catch { return []; }
}
export function saveAttempt(attempt: Attempt): boolean {
  try { const previous = parseAttempts(window.localStorage.getItem(ASSESSMENT_KEY)); window.localStorage.setItem(ASSESSMENT_KEY, JSON.stringify([...previous, attempt].slice(-MAX_ATTEMPTS))); return true; }
  catch { return false; }
}