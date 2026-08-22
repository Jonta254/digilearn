import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import manifest from "../app/manifest";
import { generateMetadata as generateCourseMetadata } from "../app/courses/[id]/page";
import renderCourseOpenGraphImage from "../app/courses/[id]/opengraph-image";
import { BrandLogo } from "../components/BrandLogo";
import { allLessonIds, findLesson, getCurriculum } from "../lib/course-library";
import { MAX_NOTE_LENGTH, normalizeNoteBody, parseNotes, parseProgress } from "../lib/learning-storage";
import { parseLocalAccount, toSession } from "../lib/local-profile";
import { parsePracticeStore } from "../lib/practice-storage";
import { isSafeExternalUrl } from "../lib/safe-url";

test("storage parsers bound and sanitize corrupt local data", () => {
  const oversized = "x".repeat(2_000_001);
  assert.deepEqual(parseProgress(oversized).completedLessonIds, []);
  assert.deepEqual(parseNotes(oversized), []);
  assert.equal(normalizeNoteBody("a".repeat(MAX_NOTE_LENGTH + 20)).length, MAX_NOTE_LENGTH);
  const note = parseNotes(JSON.stringify([{ id: "__proto__", courseId: "../bad", lessonId: "ok", body: "unsafe", updatedAt: "today" }]));
  assert.deepEqual(note, []);
});

test("practice state accepts only known keys and bounded values", () => {
  const allowed = new Set(["python::0"]);
  const state = parsePracticeStore(JSON.stringify({ cards: { "python::0": { box: 99, due: -4, seen: 2, correct: 1 }, "__proto__": { box: 1 } }, streak: -4, lastDay: "bad" }), allowed);
  assert.deepEqual(state.cards["python::0"], { box: 5, due: 0, seen: 2, correct: 1 });
  assert.equal(Object.hasOwn(state.cards, "__proto__"), false);
  assert.equal(state.streak, 0);
});

test("external URL validation rejects credentials and executable schemes", () => {
  assert.equal(isSafeExternalUrl("https://www.nist.gov/publications"), true);
  assert.equal(isSafeExternalUrl("javascript:alert(1)"), false);
  assert.equal(isSafeExternalUrl("https://user:secret@example.com"), false);
  assert.equal(isSafeExternalUrl("//example.com"), false);
});

test("local profile parsing is explicit and sessions exclude credentials", () => {
  const account = parseLocalAccount({ id: "abc", name: "Learner", email: "LEARNER@example.com", joinedAt: "2026-08-22T00:00:00.000Z", plan: "free", coursesEnrolled: [], progress: {}, streak: 0, hoursLearned: 0, password: "legacy", credential: { version: 1, salt: "salt", hash: "hash", iterations: 120000 }, __proto__: { admin: true } });
  assert.ok(account);
  const session = toSession(account);
  assert.equal("password" in session, false);
  assert.equal("credential" in session, false);
  assert.equal(session.email, "learner@example.com");
});

test("lesson loading remains selected-course and rejects invalid lesson IDs", () => {
  assert.equal(allLessonIds("chatgpt-mastery").length, 12);
  assert.equal(getCurriculum("chatgpt-mastery")?.courseId, "chatgpt-mastery");
  assert.equal(findLesson("chatgpt-mastery", "../unsafe"), undefined);
  assert.equal(getCurriculum("__proto__"), undefined);
});

test("brand component renders one accessible shared mark", () => {
  const html = renderToStaticMarkup(createElement(BrandLogo));
  assert.match(html, /brand-logo/);
  assert.match(html, /DigiLearn/);
  assert.match(html, /viewBox="0 0 48 48"/);
});

test("manifest references complete production icon sizes", () => {
  const icons = manifest().icons ?? [];
  const sizes = new Set(icons.map((icon) => icon.sizes));
  assert.ok(sizes.has("192x192"));
  assert.ok(sizes.has("512x512"));
  assert.ok(icons.some((icon) => icon.purpose === "maskable"));
});

test("course metadata is specific and canonical", async () => {
  const metadata = await generateCourseMetadata({
    params: Promise.resolve({ id: "chatgpt-mastery" }),
    searchParams: Promise.resolve({}),
  });
  assert.equal(metadata.title, "ChatGPT & GPT-4o Mastery");
  assert.equal(metadata.alternates?.canonical, "/courses/chatgpt-mastery");
  const images = metadata.openGraph?.images;
  assert.ok(Array.isArray(images));
  const image = images[0];
  assert.ok(typeof image === "object" && image !== null && "width" in image);
  assert.equal(image.width, 1200);
});
test("course Open Graph renderer returns a complete PNG", async () => {
  const response = await renderCourseOpenGraphImage({
    params: Promise.resolve({ id: "chatgpt-mastery" }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.ok((await response.arrayBuffer()).byteLength > 10_000);
});