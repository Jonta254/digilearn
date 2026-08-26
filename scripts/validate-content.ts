import { COURSES } from "../app/courses/courses";
import { getAllCurricula } from "../lib/course-library";
import { COURSE_PRICE_KES } from "../lib/pricing";
import { isSafeExternalUrl } from "../lib/safe-url";
import { editorialFor } from "../lib/course-editorial";
import { coverAssetFor, DOWNLOADS_BY_TOPIC } from "../lib/course-assets";
import { existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const COURSE_LIBRARY = getAllCurricula();
const errors: string[] = [];
const courseIds = new Set<string>();
const globalLessonIds = new Set<string>();
const visualIds = new Set<string>();
const coverIds = new Set<string>();
const safeDownloadExtensions = new Set([".md", ".txt", ".csv", ".json", ".html", ".sql"]);
const duplicateFields = new Map<string, Map<string, string[]>>();
const forbidden = [/lorem ipsum/i, /placeholder/i, /coming soon/i, /insert (text|content|image)/i];
const emoji = /[\\p{Extended_Pictographic}]/u;

function fail(scope: string, message: string) { errors.push(`${scope}: ${message}`); }
function track(field: string, value: string, scope: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();
  const values = duplicateFields.get(field) ?? new Map<string, string[]>();
  values.set(normalized, [...(values.get(normalized) ?? []), scope]);
  duplicateFields.set(field, values);
}
function nonEmpty(values: string[]) { return values.length > 0 && values.every((value) => value.trim().length > 0); }

for (const course of COURSES) {
  if (courseIds.has(course.id)) fail(course.id, "duplicate course ID");
  courseIds.add(course.id);
  if (!course.thumb.trim()) fail(course.id, "missing artwork");
  if (emoji.test(course.icon)) fail(course.id, "emoji artwork is not permitted");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(editorialFor(course).lastReviewed)) fail(course.id, "missing lastReviewed date");
  if (!course.free && (!Number.isInteger(COURSE_PRICE_KES) || COURSE_PRICE_KES <= 0)) fail(course.id, "invalid future price");

  const cover = coverAssetFor(course);
  if (cover.courseId !== course.id || !cover.assetId || !cover.alt || !cover.caption || cover.sourceReview !== "cc0-brand-icons") fail(course.id, "incomplete cover metadata");
  if (cover.iconKeys.length < 1 || cover.iconKeys.length > 2 || !cover.topicLabel || !cover.tone) fail(course.id, "incomplete brand-icon cover composition");
  if (coverIds.has(cover.assetId)) fail(course.id, `duplicate cover asset ${cover.assetId}`);
  coverIds.add(cover.assetId);
  const download = DOWNLOADS_BY_TOPIC[course.topic];
  if (!download) fail(course.id, "missing practical download or recorded reason");
  else {
    const downloadPath = join(process.cwd(), "public", download.path.replace(/^\/downloads\//, "downloads/"));
    if (!safeDownloadExtensions.has(extname(downloadPath).toLowerCase())) fail(course.id, `unsafe download extension: ${download.path}`);
    if (!existsSync(downloadPath)) fail(course.id, `missing download file: ${download.path}`);
    else if (statSync(downloadPath).size < 80) fail(course.id, `empty or shallow download file: ${download.path}`);
  }

  const curriculum = COURSE_LIBRARY[course.id];
  if (!curriculum) { fail(course.id, "missing curriculum"); continue; }
  if (curriculum.courseId !== course.id) fail(course.id, "curriculum ID mismatch");
  if (curriculum.modules.length !== 4) fail(course.id, `expected 4 modules, found ${curriculum.modules.length}`);
  if (curriculum.durationMinutes <= 0) fail(course.id, "invalid duration");
  if (curriculum.references.length < 2) fail(course.id, "needs at least two structured references");
  if (!nonEmpty(curriculum.outcomes) || !nonEmpty(curriculum.skills)) fail(course.id, "missing outcomes or skills");

  const project = curriculum.practicalOutcome;
  if (!project.objective || !project.expectedOutput || !project.nextStep || !nonEmpty(project.tools) || project.steps.length < 3 || project.successCriteria.length < 3 || project.selfReview.length < 2) {
    fail(course.id, "incomplete practical outcome");
  }

  const moduleIds = new Set<string>();
  for (const [moduleIndex, module] of curriculum.modules.entries()) {
    if (moduleIds.has(module.id)) fail(course.id, `duplicate module ID ${module.id}`);
    moduleIds.add(module.id);
    if (module.lessons.length !== 3) fail(`${course.id}/${module.id}`, `expected 3 lessons, found ${module.lessons.length}`);

    for (const lesson of module.lessons) {
      const scope = `${course.id}/${lesson.id}`;
      if (globalLessonIds.has(lesson.id)) fail(scope, "duplicate global lesson ID");
      globalLessonIds.add(lesson.id);
      if (!lesson.id.startsWith(course.id)) fail(scope, "lesson ID does not preserve course prefix");
      if (lesson.minutes <= 0) fail(scope, "invalid duration");
      if (lesson.introduction.length < 170) fail(scope, "introduction is too shallow");
      if (lesson.objectives.length < 3 || lesson.blocks.length < 5 || lesson.summary.length < 3 || lesson.commonMistakes.length < 3) fail(scope, "missing required learning sections");
      if (lesson.activity.length < 160) fail(scope, "practice activity lacks a concrete deliverable");
      if (lesson.check.options.length !== 4 || lesson.check.answer < 0 || lesson.check.answer > 3 || lesson.check.explanation.length < 70) fail(scope, "invalid knowledge check");
      if (lesson.references.length < 2) fail(scope, "needs at least two sources");
      for (const reference of lesson.references) {
        if (!reference.title || !reference.organization || !reference.accessed || !isSafeExternalUrl(reference.url) || !reference.url.startsWith("https://")) fail(scope, `invalid source: ${reference.title || reference.url}`);
      }
      if (visualIds.has(lesson.visual.id)) fail(scope, `duplicate visual ID ${lesson.visual.id}`);
      visualIds.add(lesson.visual.id);
      if (!lesson.visual.title || lesson.visual.description.length < 35 || lesson.visual.caption.length < 30 || lesson.visual.labels.length < 3) fail(scope, "incomplete visual specification");
      for (const block of lesson.blocks) if (block.type === "code" && (!block.language.trim() || !block.code.trim())) fail(scope, "code block requires a language and real source");
      const searchable = JSON.stringify(lesson);
      for (const phrase of forbidden) if (phrase.test(searchable)) fail(scope, `forbidden placeholder phrase: ${phrase}`);
      track("introduction", lesson.introduction, scope);
      track("activity", lesson.activity, scope);
      track("check", lesson.check.prompt, scope);
      track("summary", lesson.summary.join(" "), scope);
      track("objectives", lesson.objectives.join(" "), scope);
    }
    if (moduleIndex < 0) fail(course.id, "invalid module order");
  }
}

for (const [field, values] of duplicateFields) {
  for (const scopes of values.values()) if (scopes.length > 1) fail(scopes.join(", "), `duplicated ${field}`);
}
if (COURSES.length !== 72) errors.push(`catalogue: expected 72 courses, found ${COURSES.length}`);
if (Object.keys(COURSE_LIBRARY).length !== COURSES.length) errors.push("catalogue: curriculum registry does not match catalogue");
if (globalLessonIds.size !== 864) errors.push(`catalogue: expected 864 lessons, found ${globalLessonIds.size}`);
if (visualIds.size !== globalLessonIds.size) errors.push("catalogue: every lesson must have a unique visual specification");
if (coverIds.size !== COURSES.length) errors.push("catalogue: every course must have a unique cover asset");

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):\n${errors.join("\n")}`);
  process.exit(1);
}
console.log(`Content valid: ${COURSES.length} courses, ${globalLessonIds.size} unique lessons, ${visualIds.size} unique visual specifications, structured sources, unique covers, safe downloads and practical outcomes present.`);
