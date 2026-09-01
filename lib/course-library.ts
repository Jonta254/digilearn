import { COURSES, type Course } from "@/app/courses/courses";
import type { CourseCurriculum, CourseModule, Lesson } from "./learning-types";
import { getConceptBrief, TOPIC_SOURCES } from "./editorial/topic-content";

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

const VISUAL_KINDS: Record<string, Lesson["visual"]["kind"]> = {
  structure: "layers", components: "layers", entities: "layers", relationships: "layers", constraints: "layers", identity: "layers",
  limitations: "comparison", testing: "comparison", validation: "comparison", options: "comparison", evaluation: "comparison", uncertainty: "comparison",
  maintenance: "cycle", monitoring: "cycle", review: "cycle", reproducibility: "cycle", quality: "cycle", participation: "cycle",
  deployment: "timeline", response: "timeline", recovery: "timeline", implementation: "timeline", workflow: "timeline", "care pathways": "timeline",
  risk: "matrix", stakeholders: "matrix", harms: "matrix", bias: "matrix", impact: "matrix", equity: "matrix",
};

const TOPIC_VISUAL_LANGUAGE: Record<string, [string, string]> = {
  "ai-tools": ["Bounded input", "Reviewed output"], webdev: ["User and browser need", "Tested interface"], data: ["Question and source data", "Checked finding"],
  automation: ["Trigger and payload", "Observed run"], security: ["Asset and trust boundary", "Verified control"], business: ["Customer evidence", "Measured outcome"],
  databases: ["Business rule and records", "Valid data state"], ethics: ["Affected people and context", "Documented mitigation"], finance: ["Records and assumptions", "Reconciled decision"],
  healthcare: ["Patient and care context", "Safe reviewed outcome"], policy: ["Public need and evidence", "Accountable outcome"],
};

function lessonVisuals(course: Course, concept: string, tag: string, id: string, brief: NonNullable<ReturnType<typeof getConceptBrief>>): Lesson["visuals"] {
  const [input, output] = TOPIC_VISUAL_LANGUAGE[course.topic];
  const kind = VISUAL_KINDS[concept] ?? brief.visualKind;
  const focus = concept.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  const primary: Lesson["visual"] = {
    id: `${id}-concept-visual`, kind, title: `${focus}: from context to evidence`,
    description: `${focus} connects ${input.toLowerCase()} to a ${output.toLowerCase()} in ${course.title}.`,
    labels: [input, focus, output], caption: `${focus} is the decision layer between the starting context and evidence that the result is fit for purpose.`,
    takeaway: `${focus} is credible only when the result can be traced back to its purpose, inputs and constraints.`, placement: "after-objectives",
    items: [
      { label: input, detail: `Define the purpose, intended user and ${tag} constraints.` },
      { label: focus, detail: brief.application },
      { label: output, detail: "Compare the observed result with a normal case, boundary case and stated limitation." },
    ], connections: ["frames", "produces evidence for"],
  };
  if (!["flow", "cycle", "timeline"].includes(kind)) return [primary];
  return [primary, {
    id: `${id}-worked-visual`, kind: "flow", title: `A worked ${tag} evidence path`,
    description: `A four-step worked example for applying ${concept} to ${tag}, including a boundary test and revision.`,
    labels: ["Known input", "Normal test", "Boundary test", "Revision"], caption: "The boundary result changes the method before the evidence is accepted.",
    takeaway: "A successful normal case is not enough; the difficult case must influence the final method.", placement: "after-example",
    items: [
      { label: "Known input", detail: `Preserve the original ${tag} case and expected result.` },
      { label: "Normal test", detail: "Confirm the basic path behaves as expected." },
      { label: "Boundary test", detail: `Expose an assumption in the ${concept} method.` },
      { label: "Revision", detail: "Change the method, rerun both cases and record the limitation." },
    ], connections: ["test", "challenge", "improve"],
  }];
}

function lessonFor(course: Course, moduleTitle: string, concept: string, index: number, caution?: string): Lesson {
  const tag = course.tags[index % course.tags.length];
  const id = `${course.id}-${slug(moduleTitle)}-${index + 1}`;
  const brief = getConceptBrief(course.topic, concept, index);
  if (!brief) throw new Error(`Missing editorial brief for ${course.topic}:${concept}`);
  const correctAnswer = "The input, expected behaviour, normal and boundary results, and a limitation";
  const options = [`A polished ${tag} output without its input`, "A screenshot showing the tool opened", "A claim that the method always works"];
  const answer = index % 4;
  options.splice(answer, 0, correctAnswer);
  const visuals = lessonVisuals(course, concept, tag, id, brief);

  return {
    id,
    title: `${concept[0].toUpperCase() + concept.slice(1)} with ${tag}`,
    minutes: 18 + (index % 4) * 4,
    objectives: [`Explain ${concept} in the context of ${course.title}.`, `Apply ${tag} to a bounded practical task.`, "Evaluate the result using explicit quality criteria."],
    keyTerms: [concept, tag, course.topic],
    introduction: `In ${course.title}, the way a learner handles ${concept} shapes how ${tag} is used and evaluated. ${brief.definition} This ${course.level.toLowerCase()} lesson focuses on a decision or output that another person can inspect.`,
    visual: visuals[0],
    visuals,
    blocks: [
      { type: "paragraph", text: `${brief.definition} For ${tag}, distinguish performing an operation from demonstrating that it suits the stated purpose. ${brief.application} Record assumptions that could change the conclusion.` },
      { type: "steps", title: `Apply ${concept} deliberately`, items: [`State the ${course.title} task and the decision it supports.`, `Prepare a small ${tag} case with a known input and difficult boundary.`, brief.application, "Compare the observed result with the expected behaviour and explain differences.", "Save the evidence, limitation and next action in a review record."] },
      { type: "example", title: `Worked ${tag} example`, body: `A learner in ${course.title} receives a ${tag} task with one normal case and one boundary case. They apply ${concept}, retain the original input, compare each result with a stated expectation and find an assumption exposed by the boundary. After revising the method, they rerun the case and record why the new result is more defensible. ${brief.evidence}` },
      { type: "table", caption: `${concept} evidence record`, headers: ["Review point", "Evidence"], rows: [["Purpose", `The specific ${tag} outcome and intended user`], ["Method", `The ${concept} decision, input and version or context`], ["Result", "Observed output plus a checked boundary case"], ["Limitation", "What the result does not establish and the next safe action"]] },
      ...(caution ? [{ type: "callout" as const, tone: "safety" as const, title: "Scope and safety", body: caution }] : [{ type: "callout" as const, tone: "remember" as const, title: "Remember", body: "A clear, tested small result is more useful than a complex result nobody can verify." }]),
    ],
    commonMistakes: [`Using ${tag} before defining what ${concept} must achieve.`, `Checking only the easiest ${course.title} example.`, "Reporting a result without its input, assumptions or limitation."],
    activity: `For ${course.title}, complete a bounded ${tag} task demonstrating ${concept}. Keep the original input, numbered method, normal test, boundary test, observed results and a 100-word self-review naming one limitation and next improvement.`,
    summary: [`For ${course.title}, ${concept} means: ${brief.definition}`, `A credible ${tag} result includes a checked boundary, not only a successful example.`, `The next lesson builds on this ${concept} evidence record.`],
    check: { prompt: `In ${course.title}, which evidence best supports a ${concept} result produced with ${tag}?`, options, answer, explanation: `Credible ${concept} work preserves the input, states the expectation, compares contrasting tests and records a limitation.` },
    references: TOPIC_SOURCES[course.topic],
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
    references: TOPIC_SOURCES[course.topic],
    finalOutcome: `A reviewed practical project demonstrating ${course.tags.slice(0, 3).join(", ")} with documented assumptions, tests and next steps.`,
    practicalOutcome: { objective: `Produce a reviewable ${course.title} project using ${course.tags.slice(0,3).join(", ")}.`, tools: [`A suitable ${course.tags[0]} environment`, "A plain-text decision log", "Test data or realistic sample material"], steps: ["Define the intended user, outcome and constraints.", `Create the smallest complete result using ${course.tags[0]}.`, "Test one normal case, one boundary case and one failure response.", "Revise the work from the evidence and preserve before-and-after results.", "Prepare a concise handover containing method, limitations and next step."], successCriteria: ["The output matches the stated outcome.", "Inputs and decisions are reproducible.", "Boundary and failure evidence is included.", "Limitations and responsibility considerations are explicit."], expectedOutput: `A working ${course.title} artefact plus an evidence-based self-review.`, selfReview: ["Can another learner repeat the method?", "Did I test a difficult case?", "Did I avoid unsupported claims?", "Is the next action proportionate to the remaining risk?"], safety: plan.caution, nextStep: `Choose one weakness found during review and improve it before extending the ${course.tags[0]} scope.` },
    durationMinutes,
  };
}

const curriculumCache = new Map<string, CourseCurriculum>();

export function getCurriculum(courseId: string) {
  if (!/^[a-z0-9][a-z0-9-]{0,127}$/.test(courseId)) return undefined;
  const cached = curriculumCache.get(courseId);
  if (cached) return cached;
  const course = COURSES.find((item) => item.id === courseId);
  if (!course) return undefined;
  const curriculum = curriculumFor(course);
  curriculumCache.set(courseId, curriculum);
  return curriculum;
}

export function getAllCurricula(): Record<string, CourseCurriculum> {
  return Object.fromEntries(COURSES.map((course) => [course.id, getCurriculum(course.id)!]));
}

export function allLessonIds(courseId: string) {
  const course = COURSES.find((item) => item.id === courseId);
  if (!course) return [];
  const plan = PLANS[course.topic];
  return plan.modules.flatMap(([moduleTitle, concepts], moduleIndex) => concepts.map((_, lessonIndex) => `${course.id}-${slug(moduleTitle)}-${moduleIndex * 3 + lessonIndex + 1}`));
}

export function findLesson(courseId: string, lessonId?: string) {
  const curriculum = getCurriculum(courseId);
  if (!curriculum) return undefined;
  const lessons = curriculum.modules.flatMap((module) => module.lessons);
  return lessonId ? lessons.find((lesson) => lesson.id === lessonId) : lessons[0];
}
