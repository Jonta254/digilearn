import Link from "next/link";
import type { Course } from "@/app/courses/courses";
import { COURSE_PRICE_KES, formatKES } from "@/lib/pricing";
import { editorialFor } from "@/lib/course-editorial";
import { CourseCover } from "./CourseCover";
export function AccessBadge({ course }: { course: Course }) { return <span className="access-badge">{course.free ? "Open access" : `Future price: ${formatKES(COURSE_PRICE_KES)}`}</span>; }
export function CourseCard({ course }: { course: Course }) { const e=editorialFor(course); return <article className="editorial-course-card"><Link href={`/courses/${course.id}`} aria-label={`Open ${course.title}`}><CourseCover course={course}/><div className="course-card-body"><AccessBadge course={course}/><h2>{course.title}</h2><p className="course-outcome">{e.outcome}</p><p className="course-project-line"><strong>Project:</strong> {e.project}</p><div className="course-card-meta"><span>{course.level}</span><span>{course.hours} hours</span><span>Reviewed {e.lastReviewed}</span></div><strong>View course</strong></div></Link></article>; }
