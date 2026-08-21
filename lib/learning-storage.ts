import type { LearningProgress, LessonNote } from "./learning-types";

export const PROGRESS_KEY = "digilearn_progress_v2";
export const NOTES_KEY = "digilearn_notes_v1";

export const EMPTY_PROGRESS: LearningProgress = {
  version: 2,
  completedLessonIds: [],
  openedLessonIds: [],
  completedChecks: [],
};

function uniqueStrings(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string"))] : [];
}

export function parseProgress(raw: string | null): LearningProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const value = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      version: 2,
      completedLessonIds: uniqueStrings(value.completedLessonIds),
      openedLessonIds: uniqueStrings(value.openedLessonIds),
      completedChecks: uniqueStrings(value.completedChecks),
      lastVisited:
        value.lastVisited &&
        typeof value.lastVisited.courseId === "string" &&
        typeof value.lastVisited.lessonId === "string" &&
        typeof value.lastVisited.visitedAt === "string"
          ? value.lastVisited
          : undefined,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function parseNotes(raw: string | null): LessonNote[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (note): note is LessonNote =>
        note &&
        typeof note.id === "string" &&
        typeof note.courseId === "string" &&
        typeof note.lessonId === "string" &&
        typeof note.body === "string" &&
        typeof note.updatedAt === "string",
    );
  } catch {
    return [];
  }
}

export function courseProgress(progress: LearningProgress, lessonIds: string[]) {
  if (lessonIds.length === 0) return 0;
  const completed = new Set(progress.completedLessonIds);
  return Math.round((lessonIds.filter((id) => completed.has(id)).length / lessonIds.length) * 100);
}
