"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/app/courses/courses";
import type { CourseOutlineModule, Lesson, LessonBlock, PracticalOutcome } from "@/lib/learning-types";
import { EMPTY_PROGRESS, PROGRESS_KEY, courseProgress, parseProgress, readLocalValue, writeLocalValue } from "@/lib/learning-storage";
import { NoteEditor } from "./NoteEditor";
import { AccessBadge } from "./CourseCard";
import { SubjectDiagram } from "./SubjectDiagram";
import { BrandLogo } from "./BrandLogo";

function Block({ block }: { block: LessonBlock }) {
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "steps") return <section><h2>{block.title}</h2><ol className="process-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ol></section>;
  if (block.type === "example") return <aside className="content-callout example"><h2>{block.title}</h2><p>{block.body}</p></aside>;
  if (block.type === "callout") return <aside className={`content-callout ${block.tone}`}><h2>{block.title}</h2><p>{block.body}</p></aside>;
  if (block.type === "code") return <figure className="code-figure"><figcaption><span>Example file · {block.language}</span><button type="button" onClick={() => navigator.clipboard?.writeText(block.code)}>Copy code</button></figcaption><pre className="code-example" tabIndex={0}><code data-language={block.language}>{block.code}</code></pre></figure>;
  return <div className="table-wrap"><table><caption>{block.caption}</caption><thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function VisualsAt({ lesson, placement }: { lesson: Lesson; placement: Lesson["visual"]["placement"] }) {
  return <>{lesson.visuals.filter((visual) => visual.placement === placement).map((visual) => <SubjectDiagram key={visual.id} visual={visual} />)}</>;
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

export function LessonReader({ course, outline, durationMinutes, lesson, practicalOutcome }: { course: Course; outline: CourseOutlineModule[]; durationMinutes: number; lesson: Lesson; practicalOutcome: PracticalOutcome }) {
  const lessonIds = useMemo(() => outline.flatMap((module) => module.lessons.map((item) => item.id)), [outline]);
  const currentIndex = lessonIds.indexOf(lesson.id);
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    const stored = parseProgress(readLocalValue(PROGRESS_KEY));
    const openedLessonIds = [...new Set([...stored.openedLessonIds, lesson.id])];
    const next = { ...stored, openedLessonIds, lastVisited: { courseId: course.id, lessonId: lesson.id, visitedAt: new Date().toISOString() } };
    setStorageAvailable(writeLocalValue(PROGRESS_KEY, JSON.stringify(next)));
    setProgress(next);
  }, [course.id, lesson.id]);

  function updateProgress(key: "completedLessonIds" | "completedChecks") {
    setProgress((current) => {
      const next = { ...current, [key]: [...new Set([...current[key], lesson.id])] };
      setStorageAvailable(writeLocalValue(PROGRESS_KEY, JSON.stringify(next)));
      return next;
    });
  }

  const percent = courseProgress(progress, lessonIds);
  return <div className="learning-shell">
    <header className="learning-header"><Link href="/" className="wordmark" aria-label="DigiLearn home"><BrandLogo compact tone="light" /></Link><nav aria-label="Learning navigation"><Link href="/courses">Courses</Link><Link href="/practice">Practice</Link><Link href="/dashboard">Dashboard</Link></nav><button className="outline-toggle" type="button" aria-expanded={outlineOpen} onClick={() => setOutlineOpen(!outlineOpen)}>Course outline</button></header>
    {!storageAvailable ? <div className="storage-warning" role="status">Progress could not be saved. Check browser storage settings and available space.</div> : null}
    <div className="learning-progress" aria-label={`${percent}% course progress`}><span style={{ width: `${percent}%` }} /></div>
    <div className="reader-layout">
      <aside className={`course-outline ${outlineOpen ? "open" : ""}`} aria-label="Course outline"><button className="outline-close" onClick={() => setOutlineOpen(false)}>Close outline</button><p className="eyebrow">{course.level} - {Math.round(durationMinutes / 60)} hours</p><h2>{course.title}</h2>{outline.map((module, moduleIndex) => <section key={module.id}><h3>{moduleIndex + 1}. {module.title}</h3><ol>{module.lessons.map((item) => <li key={item.id}><Link className={item.id === lesson.id ? "active" : ""} href={`/courses/${course.id}?lesson=${item.id}`} onClick={() => setOutlineOpen(false)}>{progress.completedLessonIds.includes(item.id) ? "Completed: " : ""}{item.title}<small>{item.minutes} min</small></Link></li>)}</ol></section>)}</aside>
      <main id="main-content" className="lesson-content">
        <div className="lesson-context"><Link href={`/courses/${course.id}`}>{course.title}</Link><span>Lesson {currentIndex + 1} of {lessonIds.length}</span><Link href={`/courses/${course.id}/guide`}>Study guide</Link><button type="button" onClick={() => window.print()}>Print lesson</button></div>
        <article>
          <p className="eyebrow">Lesson {currentIndex + 1} of {lessonIds.length}</p><AccessBadge course={course} /><h1>{lesson.title}</h1><p className="lesson-intro">{lesson.introduction}</p>
          <section className="objectives"><h2>Learning objectives</h2><ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <VisualsAt lesson={lesson} placement="after-objectives" />
          {lesson.blocks.map((block, index) => <div className="lesson-block" key={index}>
            <Block block={block} />
            {block.type === "steps" ? <VisualsAt lesson={lesson} placement="after-steps" /> : null}
            {block.type === "example" ? <VisualsAt lesson={lesson} placement="after-example" /> : null}
            {block.type === "table" ? <VisualsAt lesson={lesson} placement="after-table" /> : null}
          </div>)}
          <section><h2>Common mistakes</h2><ul>{lesson.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="practice-activity"><p className="eyebrow">Practice activity</p><h2>Apply the lesson</h2><p>{lesson.activity}</p></section>
          <KnowledgeCheck lesson={lesson} onComplete={() => updateProgress("completedChecks")} />
          <section className="takeaways"><h2>Lesson summary</h2><ul>{lesson.summary.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2>Sources and further reading</h2><ul className="source-list">{lesson.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.title}</a><span>{reference.organization}{reference.accessed ? ` - accessed ${reference.accessed}` : ""}</span></li>)}</ul></section>
          {currentIndex === lessonIds.length - 1 ? <section className="course-project"><p className="eyebrow">Course practical outcome</p><h2>{practicalOutcome.objective}</h2><p><strong>Expected output:</strong> {practicalOutcome.expectedOutput}</p><h3>Production steps</h3><ol>{practicalOutcome.steps.map((step) => <li key={step}>{step}</li>)}</ol><h3>Success criteria</h3><ul>{practicalOutcome.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>{practicalOutcome.safety ? <p><strong>Safety note:</strong> {practicalOutcome.safety}</p> : null}<p><strong>Next step:</strong> {practicalOutcome.nextStep}</p></section> : null}
          <NoteEditor courseId={course.id} lessonId={lesson.id} />
        </article>
        <nav className="lesson-navigation" aria-label="Lesson controls">{currentIndex > 0 ? <Link href={`/courses/${course.id}?lesson=${lessonIds[currentIndex - 1]}`}>Previous lesson</Link> : <span /> }<button type="button" className="button primary" onClick={() => updateProgress("completedLessonIds")}>{progress.completedLessonIds.includes(lesson.id) ? "Lesson completed" : "Mark complete"}</button>{currentIndex < lessonIds.length - 1 ? <Link href={`/courses/${course.id}?lesson=${lessonIds[currentIndex + 1]}`}>Next lesson</Link> : <Link href="/practice">Continue to practice</Link>}</nav>
      </main>
    </div>
  </div>;
}
