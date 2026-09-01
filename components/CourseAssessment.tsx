"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Course } from "@/app/courses/courses";
import { scoreAssessment, type Answers, type CourseAssessment as AssessmentDefinition } from "@/lib/assessment";
import { saveAttempt } from "@/lib/assessment-attempts";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function CourseAssessment({ course, test }: { course: Course; test: AssessmentDefinition }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState<boolean | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const question = test.questions[index];
  const result = done ? scoreAssessment(test, answers) : null;
  const answered = Object.values(answers).filter((answer) => answer.length > 0).length;

  useEffect(() => { if (started) headingRef.current?.focus(); }, [index, done, started]);
  useEffect(() => { if (confirm) confirmationRef.current?.focus(); }, [confirm]);

  function choose(option: number) {
    const current = answers[question.id] ?? [];
    const next = question.type === "multiple"
      ? current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
      : [option];
    setAnswers({ ...answers, [question.id]: next });
  }

  function submit(force = false) {
    if (answered < test.questions.length && !force) { setConfirm(true); return; }
    const score = scoreAssessment(test, answers);
    setSaved(saveAttempt({ assessmentId: test.id, courseId: course.id, score: score.percentage, passed: score.passed, completedAt: new Date().toISOString() }));
    setDone(true);
    setConfirm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers({}); setIndex(0); setDone(false); setSaved(null); setStarted(true);
  }

  return <><SiteHeader /><main id="main-content" className="assessment-main">
    <nav className="assessment-breadcrumb" aria-label="Assessment breadcrumb"><Link href="/courses">Courses</Link><span aria-hidden="true">/</span><Link href={`/courses/${course.id}`}>{course.title}</Link><span aria-hidden="true">/</span><span>Final assessment</span></nav>
    {!started ? <section className="assessment-intro" aria-labelledby="assessment-title">
      <p className="eyebrow">Final assessment</p>
      <h1 id="assessment-title" ref={headingRef} tabIndex={-1}>{test.title}</h1>
      <p>Use this assessment after completing the course. You can retake it, and every answer includes an explanation after submission.</p>
      <dl className="assessment-facts"><div><dt>Questions</dt><dd>{test.questions.length}</dd></div><div><dt>Estimated time</dt><dd>{test.estimatedMinutes} minutes</dd></div><div><dt>Pass mark</dt><dd>{test.passingScore}%</dd></div></dl>
      <p className="assessment-device-note">Results remain in this browser and are not synchronized to another device.</p>
      <div className="assessment-actions"><button className="button primary" type="button" onClick={() => setStarted(true)}>Start assessment</button><Link className="button secondary" href={`/courses/${course.id}`}>Return to course</Link></div>
    </section> : result ? <section aria-labelledby="result-title" aria-live="polite">
      <p className="eyebrow">Assessment complete</p>
      <h1 id="result-title" ref={headingRef} tabIndex={-1}>{result.passed ? "You passed" : "Keep learning—you can retake it"}</h1>
      <div className="result-score"><strong>{result.percentage}%</strong><span>{result.correct} of {result.total} correct</span></div>
      <p>{result.passed ? `You met the ${test.passingScore}% pass mark.` : `Review the explanations below, revisit the relevant lessons, and try again when ready.`}</p>
      <p className="assessment-device-note" role="status">{saved ? "This attempt was saved in this browser." : "This attempt could not be saved. It remains visible until you leave this page."}</p>
      <div className="assessment-actions"><button className="button primary" type="button" onClick={restart}>Retake assessment</button><Link className="button secondary" href={`/courses/${course.id}`}>Return to course</Link></div>
      <section className="assessment-review" aria-labelledby="review-title"><h2 id="review-title">Review your answers</h2>{result.details.map((detail, itemIndex) => <article className={`answer-review ${detail.correct ? "correct" : "incorrect"}`} key={detail.question.id}><p className="eyebrow">Question {itemIndex + 1} · {detail.correct ? "Correct" : "Review"}</p><h3>{detail.question.question}</h3><p><strong>Your answer:</strong> {detail.selected.length ? detail.selected.map((option) => detail.question.options[option]).join("; ") : "Unanswered"}</p><p><strong>Correct answer:</strong> {detail.question.correctAnswer.map((option) => detail.question.options[option]).join("; ")}</p><p>{detail.question.explanation}</p></article>)}</section>
    </section> : <section aria-labelledby="question-title">
      <div className="assessment-status"><span>Question {index + 1} of {test.questions.length}</span><span>{answered} answered</span></div>
      <progress aria-label={`Assessment progress: question ${index + 1} of ${test.questions.length}`} value={index + 1} max={test.questions.length} />
      <h1 id="question-title" ref={headingRef} tabIndex={-1}>{question.question}</h1>
      <fieldset><legend>{question.type === "multiple" ? "Select every answer that applies" : "Select one answer"}</legend>{question.options.map((option, optionIndex) => <label className="assessment-option" key={option}><input type={question.type === "multiple" ? "checkbox" : "radio"} name={question.id} checked={(answers[question.id] ?? []).includes(optionIndex)} onChange={() => choose(optionIndex)} /><span>{option}</span></label>)}</fieldset>
      <nav className="assessment-navigation" aria-label="Question navigation"><button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous question</button>{index < test.questions.length - 1 ? <button className="button primary" type="button" onClick={() => setIndex(index + 1)}>Next question</button> : <button className="button primary" type="button" onClick={() => submit()}>Submit assessment</button>}</nav>
      {confirm ? <div className="assessment-confirm" role="region" aria-live="assertive" aria-labelledby="confirm-title"><h2 id="confirm-title" ref={confirmationRef} tabIndex={-1}>Submit with unanswered questions?</h2><p>{test.questions.length - answered} question{test.questions.length - answered === 1 ? " is" : "s are"} unanswered. Unanswered questions will be marked incorrect.</p><div className="assessment-actions"><button className="button primary" type="button" onClick={() => submit(true)}>Submit assessment</button><button className="button secondary" type="button" onClick={() => setConfirm(false)}>Keep working</button></div></div> : null}
    </section>}
  </main><SiteFooter /></>;
}
