import type { Course } from "@/app/courses/courses";
import { imageAttribution } from "@/lib/image-attributions";

export type CourseCoverAsset = {
  assetId: string;
  courseId: string;
  src: string;
  alt: string;
  caption: string;
  sourceReview: "original-local" | "licensed-photography";
  attributionId: string | null;
};

type TopicArtwork = { file: string; description: string; attributionId?: string };

const TOPIC_ART: Record<string, TopicArtwork> = {
  "ai-tools": { file: "/course-art/ai-review.svg", description: "a precise human-reviewed AI workflow" },
  webdev: { file: "/course-art/web-development.svg", description: "a responsive interface taking shape on a laptop" },
  data: { file: "/course-art/data-analysis.svg", description: "a clear analytical dashboard and source table" },
  automation: { file: "/course-art/automation.svg", description: "a connected, human-reviewed automation workflow" },
  security: { file: "/course-art/cybersecurity.svg", description: "a protected workstation and verified security controls" },
  business: { file: "/images/courses/business-planning.webp", description: "professional project planning in a real workplace", attributionId: "business-planning-pexels-10376212" },
  databases: { file: "/course-art/databases.svg", description: "related data records and a structured query" },
  ethics: { file: "/images/courses/collaborative-learning.webp", description: "adult learners evaluating evidence together", attributionId: "collaborative-learning-pexels-5940713" },
  finance: { file: "/images/courses/finance-workspace.webp", description: "hands-on financial analysis using reports and a calculator", attributionId: "finance-workspace-pexels-6694492" },
  healthcare: { file: "/images/courses/health-data-review.webp", description: "a healthcare professional using digital tools in a clinic", attributionId: "health-data-review-pexels-3881422" },
  policy: { file: "/images/courses/collaborative-learning.webp", description: "people reviewing evidence together in a learning environment", attributionId: "collaborative-learning-pexels-5940713" },
};

export function coverAssetFor(course: Course): CourseCoverAsset {
  const artwork = TOPIC_ART[course.topic] ?? TOPIC_ART.business;
  const attribution = artwork.attributionId ? imageAttribution(artwork.attributionId) : undefined;
  return {
    assetId: `cover-${course.id}-2026-08-authentic`,
    courseId: course.id,
    src: artwork.file,
    alt: attribution?.alt ?? `${course.title}: ${artwork.description}.`,
    caption: attribution
      ? `${artwork.description}. Photograph by ${attribution.creator} on ${attribution.source}, used under the ${attribution.license}.`
      : `Original DigiLearn illustration showing ${artwork.description}.`,
    sourceReview: attribution ? "licensed-photography" : "original-local",
    attributionId: attribution?.id ?? null,
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
