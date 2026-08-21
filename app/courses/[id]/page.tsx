import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES } from "../courses";
import { findLesson, getCurriculum } from "@/lib/course-library";
import { LessonReader } from "@/components/LessonReader";
import { learningAccess } from "@/lib/access-policy";
import LegacyCoursePage from "./LegacyCoursePage";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ lesson?: string }> };

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
  };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const course = COURSES.find((item) => item.id === id);
  const curriculum = getCurriculum(id);
  if (!course || !curriculum) notFound();
  if (!learningAccess.isOpen) return <LegacyCoursePage />;
  const lesson = findLesson(id, query.lesson);
  if (!lesson) notFound();
  return <LessonReader course={course} curriculum={curriculum} lesson={lesson} />;
}
