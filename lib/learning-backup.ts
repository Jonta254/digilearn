import { parseAttempts, type Attempt } from "./assessment-attempts";
import { parseNotes, parseProgress } from "./learning-storage";
import type { LearningProgress, LessonNote } from "./learning-types";

const MAX_BACKUP_LENGTH = 2_500_000;

export type LearningBackup = {
  product: "DigiLearn";
  version: 1;
  exportedAt: string;
  progress: LearningProgress;
  notes: LessonNote[];
  assessments: Attempt[];
};

export function createLearningBackup(progressRaw: string | null, notesRaw: string | null, assessmentsRaw: string | null): LearningBackup {
  return {
    product: "DigiLearn",
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: parseProgress(progressRaw),
    notes: parseNotes(notesRaw),
    assessments: parseAttempts(assessmentsRaw),
  };
}

export function parseLearningBackup(raw: string): LearningBackup | undefined {
  if (!raw || raw.length > MAX_BACKUP_LENGTH) return undefined;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const backup = value as Record<string, unknown>;
    if (backup.product !== "DigiLearn" || backup.version !== 1) return undefined;
    return {
      product: "DigiLearn",
      version: 1,
      exportedAt: typeof backup.exportedAt === "string" && Number.isFinite(Date.parse(backup.exportedAt)) ? backup.exportedAt : new Date(0).toISOString(),
      progress: parseProgress(JSON.stringify(backup.progress)),
      notes: parseNotes(JSON.stringify(backup.notes)),
      assessments: parseAttempts(JSON.stringify(backup.assessments)),
    };
  } catch {
    return undefined;
  }
}
