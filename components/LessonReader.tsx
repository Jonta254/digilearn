"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/app/courses/courses";
import type { CourseCurriculum, Lesson, LessonBlock } from "@/lib/learning-types";
import { EMPTY_PROGRESS, PROGRESS_KEY, courseProgress, parseProgress } from "@/lib/learning-storage";
import { NoteEditor } from "./NoteEditor";
import { AccessBadge } from "./CourseCard";
import { LessonFigure } from "./LessonFigure";

function Block({ block }: { block: LessonBlock }) {
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "steps") return <section><h2>{block.title}</h2><ol className="process-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ol></section>;
  if (block.type === "example") return <aside className="content-callout example"><h2>{block.title}</h2><p>{block.body}</p></aside>;
  if (block.type === "callout") return <aside className={`content-callout ${block.tone}`}><h2>{block.title}</h2><p>{block.body}</p></aside>;
  if (block.type === "code") return <pre className="code-example"><code>{block.code}</code></pre>;
  return <div className="table-wrap"><table><caption>{block.caption}</caption><thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function KnowledgeCheck({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [selected, setSelected] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === lesson.check.answer;
  return <section className="knowledge-check" aria-labelledby="check-title">
    <p className="eyebrow">Check your understanding</p><h2 id="check-title">{lesson.check.prompt}</h2>
    <fieldset><legend className="sr-only">Choose one answer</legend>{lesson.check.options.map((option, index) => <label key={option} className="answer-option"><input type="radio" name={lesson.id} checked={selected === index} onChange={() => { setSelected(index); setSubmitted(false); }} /> <span>{option}</span></label>)}</fieldset>
    <button className="button primary" type="button" disabled={selected === undefined} onClick={() => { setSubmitted(true); if (correct) onComplete(); }}>Check answer</button>
    {submitted ? <div className={correct ? "answer-feedback correct" : "answer-feedback incorrect"} role="status"><strong>{correct ? "Correct." : "Not quite."}</strong> {lesson.check.explanation}{correct ? "" : " Review the working method and try again."}</div> : null}
  </section>;
}

export function LessonReader({ course, curriculum, lesson }: { course: Course; curriculum: CourseCurriculum; lesson: Lesson }) {
  const lessonIds = useMemo(() => curriculum.modules.flatMap((module) => module.lessons.map((item) => item.id)), [curriculum]);
  const currentIndex = lessonIds.indexOf(lesson.id);
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [outlineOpen, setOutlineOpen] = useState(false);

  useEffect(() => {
    const stored = parseProgress(localStorage.getItem(PROGRESS_KEY));
    const openedLessonIds = [...new Set([...stored.openedLessonIds, lesson.id])];
    const next = { ...stored, openedLessonIds, lastVisited: { courseId: course.id, lessonId: lesson.id, visitedAt: new Date().toISOString() } };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    setProgress(next);
  }, [course.id, lesson.id]);

  function updateProgress(key: "completedLessonIds" | "completedChecks") {
    setProgress((current) => {
      const next = { ...current, [key]: [...new Set([...current[key], lesson.id])] };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }

  const percent = courseProgress(progress, lessonIds);
  return <div className="learning-shell">
    <header className="learning-header"><Link href="/" className="wordmark">DigiLearn</Link><nav aria-label="Learning navigation"><Link href="/courses">Courses</Link><Link href="/practice">Practice</Link><Link href="/dashboard">Dashboard</Link></nav><button className="outline-toggle" type="button" aria-expanded={outlineOpen} onClick={() => setOutlineOpen(!outlineOpen)}>Course outline</button></header>
    <div className="learning-progress" aria-label={`${percent}% course progress`}><span style={{ width: `${percent}%` }} /></div>
    <div className="reader-layout">
      <aside className={`course-outline ${outlineOpen ? "open" : ""}`} aria-label="Course outline"><button className="outline-close" onClick={() => setOutlineOpen(false)}>Close outline</button><p className="eyebrow">{course.level} ? {Math.round(curriculum.durationMinutes / 60)} hours</p><h2>{course.title}</h2>{curriculum.modules.map((module, moduleIndex) => <section key={module.id}><h3>{moduleIndex + 1}. {module.title}</h3><ol>{module.lessons.map((item) => <li key={item.id}><Link className={item.id === lesson.id ? "active" : ""} href={`/courses/${course.id}?lesson=${item.id}`} onClick={() => setOutlineOpen(false)}>{progress.completedLessonIds.includes(item.id) ? "? " : ""}{item.title}<small>{item.minutes} min</small></Link></li>)}</ol></section>)}</aside>
      <main id="main-content" className="lesson-content">
        <div className="lesson-context"><Link href={`/courses/${course.id}`}>{course.title}</Link><span>Lesson {currentIndex + 1} of {lessonIds.length}</span><Link href={`/courses/${course.id}/guide`}>Study guide</Link><button type="button" onClick={() => window.print()}>Print lesson</button></div>
        <article>
          <p className="eyebrow">Full course currently open</p><AccessBadge course={course} /><h1>{lesson.title}</h1><p className="lesson-intro">{lesson.introduction}</p>
          <section className="objectives"><h2>Learning objectives</h2><ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <LessonFigure title="From purpose to evidence" description="A reusable quality loop for this lesson: define the outcome, perform a bounded task, then review evidence." labels={["Define", "Apply", "Review"]} />
          {lesson.blocks.map((block, index) => <Block key={index} block={block} />)}
          <section><h2>Common mistakes</h2><ul>{lesson.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="practice-activity"><p className="eyebrow">Practice activity</p><h2>Apply the lesson</h2><p>{lesson.activity}</p></section>
          <KnowledgeCheck lesson={lesson} onComplete={() => updateProgress("completedChecks")} />
          <section className="takeaways"><h2>Lesson summary</h2><ul>{lesson.summary.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2>Sources and further reading</h2><ul>{lesson.references.map((reference) => <li key={reference}>{reference}</li>)}</ul></section>
          <NoteEditor courseId={course.id} lessonId={lesson.id} />
        </article>
        <nav className="lesson-navigation" aria-label="Lesson controls">{currentIndex > 0 ? <Link href={`/courses/${course.id}?lesson=${lessonIds[currentIndex - 1]}`}>? Previous lesson</Link> : <span /> }<button type="button" className="button primary" onClick={() => updateProgress("completedLessonIds")}>{progress.completedLessonIds.includes(lesson.id) ? "Lesson completed" : "Mark complete"}</button>{currentIndex < lessonIds.length - 1 ? <Link href={`/courses/${course.id}?lesson=${lessonIds[currentIndex + 1]}`}>Next lesson ?</Link> : <Link href="/practice">Continue to practice ?</Link>}</nav>
      </main>
    </div>
  </div>;
}
