import type { Course } from "@/app/courses/courses";

export type CourseCoverAsset = {
  assetId: string;
  courseId: string;
  src: string;
  alt: string;
  caption: string;
  sourceReview: "original-local";
  attribution: null;
};

const TOPIC_ART: Record<string, { file: string; description: string }> = {
  "ai-tools": { file: "ai-review", description: "a person reviewing an AI-assisted workflow" },
  webdev: { file: "web-development", description: "a responsive interface taking shape on a laptop" },
  data: { file: "data-analysis", description: "a clear analytical dashboard and source table" },
  automation: { file: "automation", description: "a connected, human-reviewed automation workflow" },
  security: { file: "cybersecurity", description: "a protected workstation and verified security controls" },
  business: { file: "business", description: "a project team planning client work" },
  databases: { file: "databases", description: "related data records and a structured query" },
  ethics: { file: "digital-ethics", description: "people weighing evidence and technology impacts" },
  finance: { file: "finance", description: "a cash-flow workbook and trend chart" },
  healthcare: { file: "health-data", description: "a privacy-safe health-data review" },
  policy: { file: "policy", description: "an evidence brief prepared for public-interest decisions" },
};

export function coverAssetFor(course: Course): CourseCoverAsset {
  const artwork = TOPIC_ART[course.topic] ?? TOPIC_ART.business;
  return {
    assetId: `cover-${course.id}-2026-08-repair`,
    courseId: course.id,
    src: `/course-art/${artwork.file}.svg`,
    alt: `${course.title}: ${artwork.description}.`,
    caption: `Original DigiLearn illustration showing ${artwork.description}.`,
    sourceReview: "original-local",
    attribution: null,
  };
}
export const DOWNLOADS_BY_TOPIC: Record<string, { path: string; label: string; description: string }> = {
  "ai-tools": { path: "/downloads/responsible-ai-workflow.md", label: "Responsible AI workflow", description: "A source, instruction, review and privacy-check worksheet." },
  webdev: { path: "/downloads/responsive-interface-starter.html", label: "Responsive interface starter", description: "A semantic HTML starter with a clear project region." },
  data: { path: "/downloads/analysis-practice-data.csv", label: "Analysis practice dataset", description: "Fictional monthly service data with units and dates." },
  automation: { path: "/downloads/automation-test-plan.md", label: "Automation test plan", description: "A trigger, validation, recovery and audit worksheet." },
  security: { path: "/downloads/security-review-sheet.csv", label: "Security review sheet", description: "An account and device control review with evidence fields." },
  business: { path: "/downloads/client-proposal-template.md", label: "Client proposal template", description: "A fictional service proposal with scope, timeline and acceptance checks." },
  databases: { path: "/downloads/relational-data-practice.sql", label: "Relational data practice", description: "Safe SQL schema and queries for a fictional service business." },
  ethics: { path: "/downloads/technology-impact-review.md", label: "Technology impact review", description: "A risk, affected-party, evidence and mitigation worksheet." },
  finance: { path: "/downloads/cash-flow-practice.csv", label: "Cash-flow practice file", description: "Fictional receipts and expenses with dates and KES amounts." },
  healthcare: { path: "/downloads/health-data-review.json", label: "Health-data review sample", description: "De-identified fictional records for validation practice." },
  policy: { path: "/downloads/evidence-brief-template.md", label: "Evidence brief template", description: "A source-led public-interest analysis structure." },
};
