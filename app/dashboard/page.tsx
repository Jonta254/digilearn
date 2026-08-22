import type { Metadata } from "next";
import { COURSES } from "@/app/courses/courses";
import { DashboardClient } from "@/components/DashboardClient";
import { allLessonIds } from "@/lib/course-library";

export const metadata: Metadata = { title: "Learning dashboard", description: "Review device-local DigiLearn progress and personal lesson notes.", alternates: { canonical: "/dashboard" } };

export default function DashboardPage() {
  const courseIndex = COURSES.map((course) => ({ course, lessonIds: allLessonIds(course.id) }));
  return <DashboardClient courseIndex={courseIndex} />;
}
