import Link from "next/link";
import type { Course } from "@/app/courses/courses";
import { editorialFor } from "@/lib/course-editorial";
import { reviewFor, reviewLabel } from "@/lib/course-governance";
import { CourseCover } from "./CourseCover";
export function AccessBadge({ course }: { course: Course }) { return <span className="access-badge">{reviewLabel(reviewFor(course))}</span>; }
export function CourseCard({ course }: { course: Course }) {
  const editorial = editorialFor(course);
  return <article className="editorial-course-card">
    <Link href={`/courses/${course.id}`}>
      <CourseCover course={course} />
      <div className="course-card-body">
        <AccessBadge course={course} />
        <h2>{course.title}</h2>
        <p className="course-outcome">{editorial.outcome}</p>
        <div className="course-project-preview"><span>What you’ll build</span><p>{editorial.project}</p></div>
        <div className="course-card-meta"><span>{course.level}</span><span>{course.lessons} lessons</span><span>{course.hours} hours</span></div>
        <span className="course-card-action">View course <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  </article>;
}
