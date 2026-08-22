import type { LearningProgress, LessonNote } from "./learning-types";

export const PROGRESS_KEY = "digilearn_progress_v2";
export const NOTES_KEY = "digilearn_notes_v1";
export const MAX_NOTE_LENGTH = 12_000;
export const MAX_NOTES = 500;
const MAX_PROGRESS_IDS = 5_000;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,127}$/;

export const EMPTY_PROGRESS: LearningProgress = {
  version: 2,
  completedLessonIds: [],
  openedLessonIds: [],
  completedChecks: [],
};

export function isSafeLearningId(value: unknown): value is string {
  return typeof value === "string" && SAFE_ID.test(value);
}

function uniqueIds(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter(isSafeLearningId))].slice(0, MAX_PROGRESS_IDS) : [];
}
function validDate(value: unknown): value is string {
  return typeof value === "string" && value.length <= 40 && Number.isFinite(Date.parse(value));
}
function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

export function parseProgress(raw: string | null): LearningProgress {
  if (!raw || raw.length > 2_000_000) return EMPTY_PROGRESS;
  try {
    const value = record(JSON.parse(raw));
    if (!value) return EMPTY_PROGRESS;
    const last = record(value.lastVisited);
    return {
      version: 2,
      completedLessonIds: uniqueIds(value.completedLessonIds),
      openedLessonIds: uniqueIds(value.openedLessonIds),
      completedChecks: uniqueIds(value.completedChecks),
      lastVisited: last && isSafeLearningId(last.courseId) && isSafeLearningId(last.lessonId) && validDate(last.visitedAt)
        ? { courseId: last.courseId, lessonId: last.lessonId, visitedAt: last.visitedAt }
        : undefined,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function normalizeNoteBody(value: unknown): string {
  return typeof value === "string" ? value.replace(/\u0000/g, "").slice(0, MAX_NOTE_LENGTH) : "";
}

export function parseNotes(raw: string | null): LessonNote[] {
  if (!raw || raw.length > 2_000_000) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const notes: LessonNote[] = [];
    for (const item of value.slice(0, MAX_NOTES)) {
      const note = record(item);
      if (!note || !isSafeLearningId(note.courseId) || !isSafeLearningId(note.lessonId) || !validDate(note.updatedAt)) continue;
      const body = normalizeNoteBody(note.body);
      if (!body.trim()) continue;
      const id = typeof note.id === "string" && /^[a-z0-9][a-z0-9:-]{0,260}$/.test(note.id) ? note.id : `${note.courseId}::${note.lessonId}`;
      notes.push({ id, courseId: note.courseId, lessonId: note.lessonId, body, updatedAt: note.updatedAt });
    }
    return notes;
  } catch {
    return [];
  }
}

export function readLocalValue(key: string): string | null {
  try { return typeof window === "undefined" ? null : window.localStorage.getItem(key); }
  catch { return null; }
}

export function writeLocalValue(key: string, value: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch { return false; }
}

export function courseProgress(progress: LearningProgress, lessonIds: string[]) {
  if (lessonIds.length === 0) return 0;
  const completed = new Set(progress.completedLessonIds);
  return Math.round((lessonIds.filter((id) => completed.has(id)).length / lessonIds.length) * 100);
}
