import { COURSES } from "../app/courses/courses";
import { COURSE_LIBRARY } from "../lib/course-library";
import { COURSE_PRICE_KES } from "../lib/pricing";

const errors: string[] = [];
const ids = new Set<string>();
for (const course of COURSES) {
  if (ids.has(course.id)) errors.push(`Duplicate course ID: ${course.id}`);
  ids.add(course.id);
  if (!course.thumb.trim()) errors.push(`Missing artwork: ${course.id}`);
  if (!course.free && (!Number.isInteger(COURSE_PRICE_KES) || COURSE_PRICE_KES <= 0)) errors.push(`Invalid future price: ${course.id}`);
  const curriculum = COURSE_LIBRARY[course.id];
  if (!curriculum) { errors.push(`Missing curriculum: ${course.id}`); continue; }
  if (curriculum.durationMinutes <= 0) errors.push(`Invalid duration: ${course.id}`);
  const moduleIds = new Set<string>();
  const lessonIds = new Set<string>();
  curriculum.modules.forEach((module, moduleIndex) => {
    if (moduleIds.has(module.id)) errors.push(`Duplicate module ID: ${module.id}`);
    moduleIds.add(module.id);
    module.lessons.forEach((lesson, lessonIndex) => {
      if (lessonIds.has(lesson.id)) errors.push(`Duplicate lesson ID: ${lesson.id}`);
      lessonIds.add(lesson.id);
      if (!lesson.title || !lesson.introduction || lesson.blocks.length === 0 || lesson.summary.length === 0) errors.push(`Empty lesson: ${lesson.id}`);
      if (lesson.minutes <= 0) errors.push(`Invalid lesson duration: ${lesson.id}`);
      if (!lesson.id.startsWith(course.id) || moduleIndex < 0 || lessonIndex < 0) errors.push(`Broken lesson reference: ${lesson.id}`);
    });
  });
}
if (COURSES.length !== 72) errors.push(`Expected 72 courses, found ${COURSES.length}`);
if (Object.keys(COURSE_LIBRARY).length !== COURSES.length) errors.push("Curriculum registry does not match catalogue.");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
const lessonTotal = Object.values(COURSE_LIBRARY).flatMap((course) => course.modules.flatMap((module) => module.lessons)).length;
console.log(`Content valid: ${COURSES.length} courses, ${lessonTotal} lessons, ${ids.size} unique IDs.`);
