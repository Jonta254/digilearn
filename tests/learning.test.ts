import test from "node:test";
import assert from "node:assert/strict";
import { COURSES } from "../app/courses/courses";
import { allLessonIds, findLesson, getAllCurricula } from "../lib/course-library";
import { filterCourses } from "../lib/course-search";
import { LEARNING_ACCESS_MODE, learningAccess } from "../lib/access-policy";
import { courseProgress, parseNotes, parseProgress } from "../lib/learning-storage";
import { COURSE_PRICE_KES } from "../lib/pricing";

const COURSE_LIBRARY = getAllCurricula();

test("catalogue has 72 unique stable IDs and explicit curricula", () => {
  assert.equal(COURSES.length, 72);
  assert.equal(new Set(COURSES.map((course) => course.id)).size, 72);
  assert.equal(Object.keys(COURSE_LIBRARY).length, 72);
  for (const course of COURSES) assert.ok(COURSE_LIBRARY[course.id]);
});

test("module and lesson IDs are ordered, unique and complete", () => {
  for (const course of COURSES) {
    const curriculum = COURSE_LIBRARY[course.id];
    const moduleIds = curriculum.modules.map((module) => module.id);
    const lessonIds = allLessonIds(course.id);
    assert.equal(new Set(moduleIds).size, moduleIds.length);
    assert.equal(new Set(lessonIds).size, lessonIds.length);
    assert.ok(lessonIds.length > 0);
    assert.equal(findLesson(course.id)?.id, lessonIds[0]);
  }
});

test("duration is derived from lessons", () => {
  for (const curriculum of Object.values(COURSE_LIBRARY)) {
    const total = curriculum.modules.flatMap((module) => module.lessons).reduce((sum, lesson) => sum + lesson.minutes, 0);
    assert.equal(curriculum.durationMinutes, total);
  }
});

test("open-preview policy never implies purchase", () => {
  assert.equal(LEARNING_ACCESS_MODE, "open-preview");
  assert.equal(learningAccess.isOpen, true);
  assert.ok(COURSE_PRICE_KES > 0);
  assert.match(learningAccess.detail, /Payments are not required/);
});

test("malformed local progress and notes recover safely", () => {
  assert.deepEqual(parseProgress("{bad"), { version: 2, completedLessonIds: [], openedLessonIds: [], completedChecks: [] });
  assert.deepEqual(parseNotes("{bad"), []);
  assert.deepEqual(parseNotes(JSON.stringify([{ id: "n", courseId: "c", lessonId: "l", body: "text", updatedAt: "2026-01-01" }])), [{ id: "n", courseId: "c", lessonId: "l", body: "text", updatedAt: "2026-01-01" }]);
});

test("progress is deterministic", () => {
  const ids = ["a", "b", "c", "d"];
  const progress = parseProgress(JSON.stringify({ completedLessonIds: ["a", "c"], openedLessonIds: ids, completedChecks: [] }));
  assert.equal(courseProgress(progress, ids), 50);
  assert.equal(courseProgress(progress, []), 0);
});

test("search and filtering cover title, skills, topic, level and status", () => {
  assert.ok(filterCourses(COURSES, { query: "React" }).some((course) => course.id === "react-nextjs"));
  assert.ok(filterCourses(COURSES, { query: "privacy" }).length > 0);
  assert.ok(filterCourses(COURSES, { topic: "healthcare" }).every((course) => course.topic === "healthcare"));
  assert.ok(filterCourses(COURSES, { level: "advanced" }).every((course) => course.level === "Advanced"));
  assert.ok(filterCourses(COURSES, { access: "future-priced" }).every((course) => !course.free));
});

test("invalid course IDs do not resolve", () => {
  assert.equal(findLesson("not-a-course"), undefined);
  assert.equal(findLesson("chatgpt-mastery", "../bad"), undefined);
  assert.equal(findLesson("chatgpt-mastery", "chatgpt-mastery-not-real"), undefined);
});

test("every lesson has distinct substantive editorial content and a unique visual", () => {
  const lessons = Object.values(COURSE_LIBRARY).flatMap((curriculum) => curriculum.modules.flatMap((module) => module.lessons));
  assert.equal(lessons.length, 864);
  assert.equal(new Set(lessons.map((lesson) => lesson.visual.id)).size, 864);
  for (const field of [
    lessons.map((lesson) => lesson.introduction),
    lessons.map((lesson) => lesson.activity),
    lessons.map((lesson) => lesson.check.prompt),
    lessons.map((lesson) => lesson.summary.join(" ")),
  ]) assert.equal(new Set(field).size, 864);
  for (const lesson of lessons) {
    assert.ok(lesson.blocks.length >= 5);
    assert.ok(lesson.references.length >= 2);
    assert.ok(lesson.references.every((reference) => reference.url.startsWith("https://") && reference.organization));
    assert.ok(lesson.visual.labels.length >= 3);
  }
});

test("all courses finish with a structured practical outcome", () => {
  for (const curriculum of Object.values(COURSE_LIBRARY)) {
    assert.ok(curriculum.practicalOutcome.objective);
    assert.ok(curriculum.practicalOutcome.expectedOutput);
    assert.ok(curriculum.practicalOutcome.steps.length >= 3);
    assert.ok(curriculum.practicalOutcome.successCriteria.length >= 3);
    assert.ok(curriculum.practicalOutcome.selfReview.length >= 2);
  }
});
