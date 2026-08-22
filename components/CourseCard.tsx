import Link from "next/link";
import type { Course } from "@/app/courses/courses";
import { COURSE_PRICE_KES, formatKES } from "@/lib/pricing";

export function AccessBadge({ course }: { course: Course }) {
  return <span className="access-badge">{course.free ? "Originally free" : `Future price: ${formatKES(COURSE_PRICE_KES)}`}</span>;
}

export function CourseCard({ course }: { course: Course }) {
  return <article className="editorial-course-card"><Link href={`/courses/${course.id}`} aria-label={`Open ${course.title}`}><div className="course-art" style={{ background: course.thumb }}><span aria-hidden="true">{course.icon}</span><small>{course.topic.replace("-", " ")}</small></div><div className="course-card-body"><AccessBadge course={course} /><h2>{course.title}</h2><p>{course.tags.slice(0, 3).join(" · ")}</p><div className="course-card-meta"><span>{course.level}</span><span>12 structured lessons</span></div><strong>Open course →</strong></div></Link></article>;
}
