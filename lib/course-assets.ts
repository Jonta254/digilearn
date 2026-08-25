import type { Course } from "@/app/courses/courses";

export type CoverVisualType = "code-output" | "data-analysis" | "review-workflow" | "professional-document" | "security-review" | "evidence-brief";

export type CourseCoverAsset = {
  assetId: string;
  courseId: string;
  visualType: CoverVisualType;
  alt: string;
  caption: string;
  sourceReview: "original-local";
  attribution: null;
  labels: [string, string, string];
  values: [number, number, number, number];
};

const TYPES: Record<string, CoverVisualType> = {
  "ai-tools": "review-workflow",
  webdev: "code-output",
  data: "data-analysis",
  automation: "review-workflow",
  security: "security-review",
  business: "professional-document",
  databases: "data-analysis",
  ethics: "evidence-brief",
  finance: "data-analysis",
  healthcare: "evidence-brief",
  policy: "evidence-brief",
};

function valuesFor(id: string): [number, number, number, number] {
  const seed = [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
  return [42 + seed % 37, 58 + seed % 29, 36 + seed % 41, 68 + seed % 25];
}

export function coverAssetFor(course: Course): CourseCoverAsset {
  const visualType = TYPES[course.topic] ?? "professional-document";
  const labels = [course.tags[0] ?? course.topic, course.tags[1] ?? "Practice", course.tags[2] ?? "Review"] as [string, string, string];
  const descriptions: Record<CoverVisualType, string> = {
    "code-output": `Readable ${labels[0]} source beside a validated interface result`,
    "data-analysis": `A fictional ${labels[0]} dataset with a chart derived from four defined values`,
    "review-workflow": `A human-controlled ${labels[0]} workflow moving from source to review and verification`,
    "professional-document": `A fictional professional ${labels[0]} work product with totals and review status`,
    "security-review": `An accurate ${labels[0]} protection review with configuration and response checks`,
    "evidence-brief": `A structured ${labels[0]} evidence brief separating source, finding and action`,
  };
  return {
    assetId: `cover-${course.id}-2026-08`, courseId: course.id, visualType,
    alt: `${course.title} cover. ${descriptions[visualType]}.`,
    caption: `${descriptions[visualType]} created locally for the ${course.title} practical project.`,
    sourceReview: "original-local", attribution: null, labels, values: valuesFor(course.id),
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
