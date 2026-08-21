"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COURSES } from "@/app/courses/courses";
import { allLessonIds } from "@/lib/course-library";
import { EMPTY_PROGRESS, NOTES_KEY, PROGRESS_KEY, courseProgress, parseNotes, parseProgress } from "@/lib/learning-storage";
import type { LearningProgress, LessonNote } from "@/lib/learning-types";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function DashboardPage() {
  const [progress, setProgress] = useState<LearningProgress>(EMPTY_PROGRESS);
  const [notes, setNotes] = useState<LessonNote[]>([]);
  useEffect(() => { setProgress(parseProgress(localStorage.getItem(PROGRESS_KEY))); setNotes(parseNotes(localStorage.getItem(NOTES_KEY))); }, []);
  const active = useMemo(() => COURSES.map((course) => ({ course, percent: courseProgress(progress, allLessonIds(course.id)), opened: allLessonIds(course.id).filter((id) => progress.openedLessonIds.includes(id)).length })).filter((item) => item.opened > 0).sort((a, b) => b.opened - a.opened), [progress]);
  const completed = progress.completedLessonIds.length;
  const lastCourse = progress.lastVisited ? COURSES.find((course) => course.id === progress.lastVisited?.courseId) : undefined;
  return <><SiteHeader /><main id="main-content" className="dashboard-page"><header className="editorial-hero compact"><p className="eyebrow">Saved on this device</p><h1>Your learning dashboard</h1><p>Progress reflects lessons you actually open and complete. It does not synchronize across devices yet.</p>{lastCourse && progress.lastVisited ? <Link className="button primary inline-button" href={`/courses/${lastCourse.id}?lesson=${progress.lastVisited.lessonId}`}>Continue {lastCourse.title} ?</Link> : null}</header>
  <section className="truthful-stats" aria-label="Learning summary"><div><strong>{active.length}</strong><span>Courses started</span></div><div><strong>{completed}</strong><span>Lessons completed</span></div><div><strong>{notes.length}</strong><span>Saved notes</span></div><div><strong>{progress.completedChecks.length}</strong><span>Checks completed</span></div></section>
  {active.length ? <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Continue learning</p><h2>Courses in progress</h2></div><Link href="/courses">Browse all courses</Link></div><div className="progress-list">{active.map(({ course, percent, opened }) => <article key={course.id}><div><span aria-hidden="true">{course.icon}</span><div><h3>{course.title}</h3><p>{opened} lessons opened ? {percent}% completed</p></div></div><div className="honest-progress" aria-label={`${percent}% complete`}><span style={{ width: `${percent}%` }} /></div><Link href={`/courses/${course.id}`}>Continue course ?</Link></article>)}</div></section> : <section className="empty-state dashboard-empty"><h2>No lessons opened yet</h2><p>Choose a course and open its first lesson. Your activity will appear here automatically.</p><Link href="/courses" className="button primary inline-button">Choose your first course</Link></section>}
  <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Personal notes</p><h2>Recent notes</h2></div></div>{notes.length ? <div className="recent-notes">{notes.slice(0, 6).map((note) => { const course = COURSES.find((item) => item.id === note.courseId); return <article key={note.id}><h3>{course?.title ?? "Course note"}</h3><p>{note.body.slice(0, 180)}{note.body.length > 180 ? "?" : ""}</p><small>Saved {new Date(note.updatedAt).toLocaleString()}</small><Link href={`/courses/${note.courseId}?lesson=${note.lessonId}`}>Open lesson and note ?</Link></article>; })}</div> : <p className="quiet-message">No notes saved yet. Each lesson has a private note editor stored only in this browser.</p>}</section>
  <aside className="device-guidance"><strong>About local learning records</strong><p>DigiLearn currently stores progress and notes in this browser. Clearing site data or changing devices can remove them. Account backup and cross-device sync require a future backend stage.</p></aside></main><SiteFooter /></>;
}
