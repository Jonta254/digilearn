export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "steps"; title: string; items: string[] }
  | { type: "example"; title: string; body: string }
  | { type: "callout"; tone: "note" | "safety" | "remember"; title: string; body: string }
  | { type: "code"; language: string; code: string }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] };

export type KnowledgeCheck = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  objectives: string[];
  keyTerms: string[];
  introduction: string;
  blocks: LessonBlock[];
  commonMistakes: string[];
  activity: string;
  summary: string[];
  check: KnowledgeCheck;
  references: string[];
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type CourseCurriculum = {
  courseId: string;
  overview: string;
  intendedLearner: string;
  prerequisites: string[];
  outcomes: string[];
  skills: string[];
  modules: CourseModule[];
  glossary: Record<string, string>;
  references: string[];
  finalOutcome: string;
  durationMinutes: number;
};

export type LearningProgress = {
  version: 2;
  completedLessonIds: string[];
  openedLessonIds: string[];
  completedChecks: string[];
  lastVisited?: { courseId: string; lessonId: string; visitedAt: string };
};

export type LessonNote = {
  id: string;
  courseId: string;
  lessonId: string;
  body: string;
  updatedAt: string;
};
