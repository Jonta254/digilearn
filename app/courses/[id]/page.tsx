import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES } from "../courses";
import { findLesson, getCurriculum } from "@/lib/course-library";
import { LessonReader } from "@/components/LessonReader";
import { learningAccess } from "@/lib/access-policy";
import LegacyCoursePage from "./LegacyCoursePage";
import { CourseOverview } from "@/components/CourseOverview";
import { Assessment } from "@/components/Assessment";
import { createCourseAssessment } from "@/lib/assessment";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ lesson?: string; assessment?: string }> };

export function generateStaticParams() {
  return COURSES.map((course) => ({ id: course.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = COURSES.find((item) => item.id === id);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: `Study ${course.title} through structured lessons, practical activities, knowledge checks and device-local notes.`,
    alternates: { canonical: `/courses/${course.id}` },
    openGraph: { title: course.title, description: `Study ${course.title} through 12 structured DigiLearn lessons.`, url: `/courses/${course.id}`, images: [{ url: `/courses/${course.id}/opengraph-image`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: course.title, description: `Study ${course.title} through 12 structured DigiLearn lessons.`, images: [`/courses/${course.id}/opengraph-image`] },
  };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const course = COURSES.find((item) => item.id === id);
  const curriculum = getCurriculum(id);
  if (!course || !curriculum) notFound();
  if (!learningAccess.isOpen) return <LegacyCoursePage />;
  if (query.assessment === "final") return <Assessment course={course} test={createCourseAssessment(course, curriculum)} />;
  if (!query.lesson) return <CourseOverview course={course} curriculum={curriculum} />;
  const lesson = findLesson(id, query.lesson);
  if (!lesson) notFound();
  const outline = curriculum.modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.map(({ id: lessonId, title, minutes }) => ({ id: lessonId, title, minutes })),
  }));
  return <LessonReader course={course} outline={outline} durationMinutes={curriculum.durationMinutes} lesson={lesson} practicalOutcome={curriculum.practicalOutcome} />;
}
