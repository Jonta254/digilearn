export type SourceReference = {
  title: string;
  organization: string;
  url: string;
  accessed?: string;
  licence?: string;
};

export type LessonVisual = {
  id: string;
  kind: "flow" | "cycle" | "comparison" | "layers" | "timeline" | "matrix";
  title: string;
  description: string;
  labels: string[];
  caption: string;
  takeaway: string;
  placement: "after-objectives" | "after-steps" | "after-example" | "after-table";
  items: Array<{ label: string; detail: string }>;
  connections?: string[];
};

export type PracticalOutcome = {
  objective: string; tools: string[]; steps: string[]; successCriteria: string[];
  expectedOutput: string; selfReview: string[]; safety?: string; nextStep: string;
};

export type CourseOutlineModule = {
  id: string;
  title: string;
  lessons: Array<Pick<Lesson, "id" | "title" | "minutes">>;
};

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
  visual: LessonVisual;
  visuals: LessonVisual[];
  commonMistakes: string[];
  activity: string;
  summary: string[];
  check: KnowledgeCheck;
  references: SourceReference[];
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
  references: SourceReference[];
  finalOutcome: string;
  practicalOutcome: PracticalOutcome;
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
