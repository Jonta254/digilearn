import { COURSES, type Course } from "@/app/courses/courses";
import type { CourseCurriculum, CourseModule, Lesson } from "./learning-types";

type TopicPlan = {
  audience: string;
  prerequisites: string[];
  modules: [string, string[]][];
  caution?: string;
  references: string[];
};

const PLANS: Record<string, TopicPlan> = {
  "ai-tools": { audience: "People who want dependable, responsible AI-assisted workflows.", prerequisites: ["Basic computer and web skills"], modules: [["Foundations", ["capabilities", "limitations", "responsible use"]], ["Working methods", ["clear instructions", "context design", "verification"]], ["Applied workflows", ["research", "creation", "automation"]], ["Quality and review", ["evaluation", "privacy", "repeatable practice"]]], references: ["NIST AI Risk Management Framework", "OECD AI Principles", "Official documentation for the tools used"] },
  webdev: { audience: "Learners building accessible, maintainable web products.", prerequisites: ["Comfort using a browser and text editor"], modules: [["Web foundations", ["standards", "structure", "developer tools"]], ["Core implementation", ["components", "state and data", "responsive layout"]], ["Quality", ["accessibility", "testing", "performance"]], ["Production practice", ["security", "deployment", "maintenance"]]], references: ["MDN Web Docs", "W3C Web Standards", "Official framework documentation"] },
  data: { audience: "Learners using data and code to answer practical questions.", prerequisites: ["Basic numeracy and file-management skills"], modules: [["Data foundations", ["problem framing", "data types", "tool setup"]], ["Analysis", ["cleaning", "exploration", "modelling"]], ["Evaluation", ["validation", "uncertainty", "communication"]], ["Applied project", ["workflow", "review", "reproducibility"]]], references: ["Python documentation", "scikit-learn User Guide", "The Turing Way"] },
  automation: { audience: "People designing reliable no-code and low-code workflows.", prerequisites: ["Basic spreadsheet and web-app experience"], modules: [["Workflow design", ["triggers", "actions", "data mapping"]], ["Building", ["connections", "conditions", "transformations"]], ["Reliability", ["errors", "testing", "monitoring"]], ["Operations", ["documentation", "security", "maintenance"]]], references: ["Official product documentation", "OWASP API Security Top 10", "NIST Privacy Framework"] },
  security: { audience: "Defenders and developers learning lawful, defensive security practice.", prerequisites: ["Basic networking and operating-system knowledge"], caution: "Use security techniques only on systems you own or are explicitly authorised to test.", modules: [["Security foundations", ["assets", "threats", "risk"]], ["Defensive controls", ["identity", "network protection", "hardening"]], ["Assessment", ["safe testing", "evidence", "remediation"]], ["Operations", ["monitoring", "response", "recovery"]]], references: ["NIST Cybersecurity Framework 2.0", "OWASP Web Security Testing Guide", "CISA Cybersecurity Guidance"] },
  business: { audience: "People developing evidence-based digital products and services.", prerequisites: ["A problem area or customer group to investigate"], modules: [["Customer evidence", ["problem discovery", "research", "positioning"]], ["Offer design", ["scope", "value", "pricing"]], ["Delivery", ["operations", "quality", "finance"]], ["Sustainable growth", ["measurement", "retention", "risk"]]], references: ["U.S. Small Business Administration learning resources", "UK Government business guidance", "Strategyzer testing guidance"] },
  databases: { audience: "Developers and analysts who need dependable data systems.", prerequisites: ["Basic programming or spreadsheet experience"], modules: [["Data modelling", ["entities", "relationships", "constraints"]], ["Querying", ["selection", "joins", "aggregation"]], ["Reliability", ["transactions", "indexes", "backups"]], ["Production design", ["security", "performance", "operations"]]], references: ["PostgreSQL Documentation", "MongoDB Documentation", "Redis Documentation"] },
  ethics: { audience: "Product, policy and technical learners evaluating responsible AI.", prerequisites: ["No specialist background required"], modules: [["Ethical foundations", ["stakeholders", "harms", "rights"]], ["Evidence", ["bias", "measurement", "impact"]], ["Governance", ["accountability", "documentation", "oversight"]], ["Practice", ["risk review", "participation", "monitoring"]]], references: ["UNESCO Recommendation on the Ethics of AI", "NIST AI RMF", "OECD AI Principles"] },
  finance: { audience: "Learners studying financial technology and analytical methods.", prerequisites: ["Basic percentages and spreadsheet skills"], caution: "This course is general education, not financial, investment, tax or legal advice.", modules: [["Financial foundations", ["value", "risk", "markets"]], ["Tools and data", ["records", "analysis", "controls"]], ["Applied decisions", ["scenarios", "evaluation", "reporting"]], ["Risk and governance", ["security", "regulation", "review"]]], references: ["Central Bank of Kenya publications", "Bank for International Settlements resources", "Official software documentation"] },
  healthcare: { audience: "Learners exploring health technology without replacing clinical expertise.", prerequisites: ["Basic data literacy"], caution: "This material is educational and does not provide medical advice or replace qualified clinical judgement.", modules: [["Health context", ["care pathways", "health data", "stakeholders"]], ["Digital systems", ["standards", "interoperability", "workflows"]], ["Quality and safety", ["validation", "privacy", "human oversight"]], ["Applied evaluation", ["implementation", "monitoring", "equity"]]], references: ["World Health Organization digital health guidance", "HL7 FHIR specification", "Kenya Ministry of Health publications"] },
  policy: { audience: "Public-interest learners using evidence and technology responsibly.", prerequisites: ["Basic research and spreadsheet skills"], modules: [["Public problems", ["stakeholders", "institutions", "evidence"]], ["Digital methods", ["open data", "services", "participation"]], ["Policy design", ["options", "impact", "implementation"]], ["Accountability", ["measurement", "transparency", "maintenance"]]], references: ["World Bank Open Data guidance", "OECD Digital Government resources", "Kenya Open Data Portal"] },
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function lessonFor(course: Course, moduleTitle: string, concept: string, index: number, caution?: string): Lesson {
  const tag = course.tags[index % course.tags.length];
  const id = `${course.id}-${slug(moduleTitle)}-${index + 1}`;
  return {
    id,
    title: `${concept[0].toUpperCase() + concept.slice(1)} with ${tag}`,
    minutes: 18 + (index % 4) * 4,
    objectives: [`Explain ${concept} in the context of ${course.title}.`, `Apply ${tag} to a bounded practical task.`, "Evaluate the result using explicit quality criteria."],
    keyTerms: [concept, tag, course.topic],
    introduction: `${concept[0].toUpperCase() + concept.slice(1)} is a practical part of ${course.title}. This lesson connects the idea to a concrete decision, shows a repeatable method, and makes the limits visible.`,
    blocks: [
      { type: "paragraph", text: `Start with the outcome, evidence and constraints. In ${course.title}, ${concept} is useful only when the learner can explain what changed, why the method fits, and how the result was checked. ${tag} is the working focus for this lesson, not a shortcut around judgement.` },
      { type: "steps", title: "A dependable working method", items: ["Define one observable outcome and the people affected.", `Prepare the smallest useful ${tag} example and record assumptions.`, "Perform the task in small steps, checking each intermediate result.", "Test the result against the stated outcome, edge cases and relevant safety constraints.", "Document what worked, what failed and the next improvement."] },
      { type: "example", title: "Worked example", body: `Imagine a small team using ${tag} for a ${course.topic.replace("-", " ")} task. They first write a measurable acceptance condition, produce a limited trial, compare the output with a manually checked reference, and keep a short decision log. The useful result is not merely an output; it is an output that another person can inspect and reproduce.` },
      { type: "table", caption: "Quality review", headers: ["Question", "Evidence to collect"], rows: [["Does it solve the stated problem?", "A result tied to the acceptance condition"], ["Can another person reproduce it?", "Inputs, steps and version information"], ["What could go wrong?", "Edge cases, affected users and recovery steps"]] },
      ...(caution ? [{ type: "callout" as const, tone: "safety" as const, title: "Scope and safety", body: caution }] : [{ type: "callout" as const, tone: "remember" as const, title: "Remember", body: "A clear, tested small result is more useful than a complex result nobody can verify." }]),
    ],
    commonMistakes: ["Starting with a tool before defining the problem.", "Treating a successful first attempt as sufficient evidence.", "Failing to record assumptions, versions or limitations."],
    activity: `Create a one-page ${concept} checklist for a realistic ${tag} task. Include the outcome, inputs, three test cases, a failure response and one improvement you would make after review.`,
    summary: [`${concept} should connect to an observable outcome.`, "Small tests expose assumptions early.", "Documentation makes practical work reviewable and reusable."],
    check: { prompt: `Which action best demonstrates sound ${concept} practice?`, options: ["Use the most complex tool available", "Define an outcome, test a bounded example and record evidence", "Copy an example without checking its context", "Assume the first successful result is production-ready"], answer: 1, explanation: "A bounded test tied to an outcome produces evidence and makes limitations visible." },
    references: PLANS[course.topic].references,
  };
}

function curriculumFor(course: Course): CourseCurriculum {
  const plan = PLANS[course.topic];
  const modules: CourseModule[] = plan.modules.map(([title, concepts], moduleIndex) => ({
    id: `${course.id}-module-${moduleIndex + 1}`,
    title,
    summary: `Apply ${course.tags[moduleIndex % course.tags.length]} through ${concepts.join(", ")}.`,
    lessons: concepts.map((concept, lessonIndex) => lessonFor(course, title, concept, moduleIndex * 3 + lessonIndex, plan.caution)),
  }));
  const durationMinutes = modules.flatMap((module) => module.lessons).reduce((sum, lesson) => sum + lesson.minutes, 0);
  return {
    courseId: course.id,
    overview: `${course.title} is a structured, practical course covering ${course.tags.join(", ")}. It emphasizes explainable methods, checked work and a final outcome that can be reviewed.`,
    intendedLearner: plan.audience,
    prerequisites: plan.prerequisites,
    outcomes: course.tags.slice(0, 4).map((tag) => `Use ${tag} appropriately in a realistic, bounded task.`),
    skills: [...course.tags, "Critical evaluation", "Documentation"],
    modules,
    glossary: Object.fromEntries(course.tags.map((tag) => [tag, `A core concept or tool used in ${course.title}; its exact meaning is established in the relevant lesson.`])),
    references: plan.references,
    finalOutcome: `A reviewed practical project demonstrating ${course.tags.slice(0, 3).join(", ")} with documented assumptions, tests and next steps.`,
    durationMinutes,
  };
}

export const COURSE_LIBRARY: Record<string, CourseCurriculum> = Object.fromEntries(
  COURSES.map((course) => [course.id, curriculumFor(course)]),
);

export function getCurriculum(courseId: string) {
  return COURSE_LIBRARY[courseId];
}

export function allLessonIds(courseId: string) {
  return getCurriculum(courseId)?.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)) ?? [];
}

export function findLesson(courseId: string, lessonId?: string) {
  const curriculum = getCurriculum(courseId);
  if (!curriculum) return undefined;
  const lessons = curriculum.modules.flatMap((module) => module.lessons);
  return lessons.find((lesson) => lesson.id === lessonId) ?? lessons[0];
}
