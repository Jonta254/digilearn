import Link from "next/link";
import type { Course } from "@/app/courses/courses";
import type { CourseCurriculum } from "@/lib/learning-types";
import { editorialFor } from "@/lib/course-editorial";
import { AccessBadge } from "./CourseCard";
import { CourseCover } from "./CourseCover";
import { courseGuidePdfPath, DOWNLOADS_BY_TOPIC } from "@/lib/course-assets";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function CourseOverview({ course, curriculum }: { course: Course; curriculum: CourseCurriculum }) {
  const editorial = editorialFor(course);
  const firstLesson = curriculum.modules[0].lessons[0];
  const resource = DOWNLOADS_BY_TOPIC[course.topic];
  const pdf = courseGuidePdfPath(course.id);
  const lessonCount = curriculum.modules.reduce((count, module) => count + module.lessons.length, 0);

  return <><SiteHeader /><main id="main-content" className="course-overview">
    <header className="course-overview-hero">
      <div>
        <p className="eyebrow">{course.level} / Reviewed {editorial.lastReviewed}</p>
        <AccessBadge course={course} />
        <h1>{course.title}</h1>
        <p className="course-overview-lead">{editorial.outcome}. You will finish with {editorial.project}.</p>
        <div className="hero-actions">
          <Link className="button primary inline-button" href={`/courses/${course.id}?lesson=${firstLesson.id}`}>Start first lesson</Link>
          <a className="button secondary inline-button" href={pdf} download>Download PDF guide</a>
          <Link className="text-link" href={`/courses/${course.id}/guide`}>Preview guide</Link><Link className="text-link" href={`/courses/${course.id}?assessment=final`}>Final assessment</Link>
        </div>
        <p className="browser-limit">Progress and notes are stored only in this browser. They are not synchronized or backed up.</p>
      </div>
      <CourseCover course={course} priority />
    </header>

    <section className="course-value-strip" aria-label="Course learning format">
      <div><strong>{lessonCount}</strong><span>guided lessons</span></div>
      <div><strong>{curriculum.modules.length}</strong><span>focused modules</span></div>
      <div><strong>1</strong><span>reviewable project</span></div>
      <div><strong>PDF</strong><span>offline workbook</span></div>
    </section>

    <div className="course-decision-grid">
      <section>
        <p className="eyebrow">The problem</p><h2>What this course helps you do</h2><p>{curriculum.overview}</p>
        <h3>Who it is for</h3><p>{curriculum.intendedLearner}</p>
        <h3>Prerequisites</h3><ul>{curriculum.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <aside>
        <h2>Course at a glance</h2>
        <dl><div><dt>Time</dt><dd>{Math.round(curriculum.durationMinutes / 60)} hours</dd></div><div><dt>Level</dt><dd>{course.level}</dd></div><div><dt>Lessons</dt><dd>{lessonCount}</dd></div><div><dt>Tools</dt><dd>{curriculum.practicalOutcome.tools.join(", ")}</dd></div></dl>
        <a className="course-pdf-card" href={pdf} download><span>Offline study pack</span><strong>Download the complete PDF</strong><small>Course map, capstone plan, evidence log and primary references.</small></a>
      </aside>
    </div>

    <section className="course-project-showcase">
      <div className="project-showcase-copy"><p className="eyebrow">Portfolio-ready project</p><h2>{curriculum.practicalOutcome.objective}</h2><p><strong>Deliverable:</strong> {curriculum.practicalOutcome.expectedOutput}</p>
        <div className="project-downloads"><a href={resource.path} download>{resource.label}</a><a href="/downloads/digilearn-project-brief.md" download>Project brief</a><a href={pdf} download>PDF workbook</a></div>
        <p className="download-description">{resource.description} All practice data is fictional and safe to use.</p>
      </div>
      <div className="project-proof"><span>Definition of done</span><ul>{curriculum.practicalOutcome.successCriteria.slice(0, 4).map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div>
    </section>

    <section className="course-modules"><p className="eyebrow">Course plan</p><h2>From first concept to finished work</h2>
      {curriculum.modules.map((module, index) => <article key={module.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{module.title}</h3><p>{module.summary}</p><ol>{module.lessons.map((lesson) => <li key={lesson.id}><Link href={`/courses/${course.id}?lesson=${lesson.id}`}>{lesson.title}<small>{lesson.minutes} min</small></Link></li>)}</ol></div></article>)}
    </section>

    <section className="course-sources"><p className="eyebrow">Source-led learning</p><h2>Authoritative references</h2><p>Course claims are grounded in primary documentation and recognized public guidance. Recheck version-sensitive information before professional use.</p>
      <ul>{curriculum.references.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><span>{source.organization}</span></li>)}</ul>
    </section>
  </main><SiteFooter /></>;
}
