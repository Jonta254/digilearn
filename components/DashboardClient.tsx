"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/app/courses/courses";
import { EMPTY_PROGRESS, NOTES_KEY, PROGRESS_KEY, courseProgress, parseNotes, parseProgress, readLocalValue } from "@/lib/learning-storage";
import type { LearningProgress, LessonNote } from "@/lib/learning-types";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ASSESSMENT_KEY } from "@/lib/assessment-attempts";
import { createLearningBackup, parseLearningBackup } from "@/lib/learning-backup";

type IndexedCourse = { course: Course; lessonIds: string[] };

export function DashboardClient({ courseIndex }: { courseIndex: IndexedCourse[] }) {
  const [progress, setProgress] = useState<LearningProgress>(EMPTY_PROGRESS);
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [dataStatus, setDataStatus] = useState("");
  useEffect(() => { setProgress(parseProgress(readLocalValue(PROGRESS_KEY))); setNotes(parseNotes(readLocalValue(NOTES_KEY))); }, []);
  const active = useMemo(() => courseIndex.map(({ course, lessonIds }) => ({ course, lessonIds, percent: courseProgress(progress, lessonIds), opened: lessonIds.filter((id) => progress.openedLessonIds.includes(id)).length })).filter((item) => item.opened > 0).sort((a, b) => b.opened - a.opened), [courseIndex, progress]);
  const validNotes = useMemo(() => notes.filter((note) => courseIndex.some(({ course, lessonIds }) => course.id === note.courseId && lessonIds.includes(note.lessonId))), [courseIndex, notes]);
  const completed = progress.completedLessonIds.length;
  const last = progress.lastVisited ? courseIndex.find(({ course, lessonIds }) => course.id === progress.lastVisited?.courseId && lessonIds.includes(progress.lastVisited.lessonId)) : undefined;
  function exportData() {
    const backup = createLearningBackup(readLocalValue(PROGRESS_KEY), readLocalValue(NOTES_KEY), readLocalValue(ASSESSMENT_KEY));
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `digilearn-learning-record-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDataStatus("Learning record downloaded.");
  }
  async function importData(file: File | undefined) {
    if (!file) return;
    if (file.size > 2_500_000) return setDataStatus("That file is too large to be a DigiLearn learning record.");
    const backup = parseLearningBackup(await file.text());
    if (!backup) return setDataStatus("That file is not a valid DigiLearn learning record.");
    const saved = [
      [PROGRESS_KEY, backup.progress], [NOTES_KEY, backup.notes], [ASSESSMENT_KEY, backup.assessments],
    ].every(([key, value]) => { try { localStorage.setItem(key as string, JSON.stringify(value)); return true; } catch { return false; } });
    if (!saved) return setDataStatus("The learning record could not be restored. Check browser storage settings.");
    setProgress(backup.progress); setNotes(backup.notes); setDataStatus("Learning record restored on this device.");
  }
  function clearData() {
    if (!window.confirm("Remove progress, notes and assessment attempts from this device? This cannot be undone unless you exported a backup.")) return;
    try { localStorage.removeItem(PROGRESS_KEY); localStorage.removeItem(NOTES_KEY); localStorage.removeItem(ASSESSMENT_KEY); }
    catch { return setDataStatus("Learning records could not be removed. Check browser storage settings."); }
    setProgress(EMPTY_PROGRESS); setNotes([]); setDataStatus("Learning records removed from this device.");
  }
  return <><SiteHeader /><main id="main-content" className="dashboard-page"><header className="editorial-hero compact"><p className="eyebrow">Saved on this device</p><h1>Your learning dashboard</h1><p>Progress reflects lessons you actually open and complete. It does not synchronize across devices yet.</p>{last && progress.lastVisited ? <Link className="button primary inline-button" href={`/courses/${last.course.id}?lesson=${progress.lastVisited.lessonId}`}>Continue {last.course.title}</Link> : null}</header>
  <section className="truthful-stats" aria-label="Learning summary"><div><strong>{active.length}</strong><span>Courses started</span></div><div><strong>{completed}</strong><span>Lessons completed</span></div><div><strong>{validNotes.length}</strong><span>Saved notes</span></div><div><strong>{progress.completedChecks.length}</strong><span>Checks completed</span></div></section>
  {active.length ? <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Continue learning</p><h2>Courses in progress</h2></div><Link href="/courses">Browse all courses</Link></div><div className="progress-list">{active.map(({ course, percent, opened }) => { const resumeLesson = progress.lastVisited?.courseId === course.id ? progress.lastVisited.lessonId : undefined; return <article key={course.id}><div><span className="progress-course-mark" aria-hidden="true" /><div><h3>{course.title}</h3><p>{opened} lessons opened · {percent}% completed</p></div></div><div className="honest-progress" role="progressbar" aria-label={`${course.title} completion`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div><Link href={resumeLesson ? `/courses/${course.id}?lesson=${resumeLesson}` : `/courses/${course.id}`}>{resumeLesson ? "Resume last lesson" : "Continue course"}</Link></article>; })}</div></section> : <section className="empty-state dashboard-empty"><h2>No lessons opened yet</h2><p>Choose a course and open its first lesson. Your activity will appear here automatically.</p><Link href="/courses" className="button primary inline-button">Choose your first course</Link></section>}
  <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Personal notes</p><h2>Recent notes</h2></div></div>{validNotes.length ? <div className="recent-notes">{validNotes.slice(0, 6).map((note) => { const course = courseIndex.find((item) => item.course.id === note.courseId)?.course; return <article key={note.id}><h3>{course?.title ?? "Course note"}</h3><p>{note.body.slice(0, 180)}{note.body.length > 180 ? "..." : ""}</p><small>Saved {new Date(note.updatedAt).toLocaleString()}</small><Link href={`/courses/${note.courseId}?lesson=${note.lessonId}`}>Open lesson and note</Link></article>; })}</div> : <p className="quiet-message">No notes saved yet. Each lesson has a private note editor stored only in this browser.</p>}</section>
  <section className="dashboard-section data-controls" aria-labelledby="data-controls-title"><div><p className="eyebrow">Data controls</p><h2 id="data-controls-title">Manage your learning record</h2><p>Download a portable JSON backup of progress, notes and assessment attempts, or restore one on this device. Practice-deck history and optional device profiles are not included.</p></div><div className="data-control-actions"><button className="button primary" type="button" onClick={exportData}>Download backup</button><label className="button quiet" htmlFor="learning-record-upload">Restore backup<input id="learning-record-upload" className="sr-only" type="file" accept="application/json,.json" onChange={(event) => { void importData(event.target.files?.[0]); event.target.value = ""; }} /></label><button className="button danger" type="button" onClick={clearData}>Clear learning record</button></div><p className="data-status" role="status" aria-live="polite">{dataStatus}</p></section>
  <aside className="device-guidance"><strong>About local learning records</strong><p>DigiLearn stores learning records in this browser. Clearing site data or changing devices can remove them. Download a backup before clearing browser data or moving devices; automatic cloud sync is not available.</p></aside></main><SiteFooter /></>;
}
