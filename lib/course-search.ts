import type { Course } from "@/app/courses/courses";

export type CourseFilters = { query?: string; topic?: string; level?: string; access?: "all" | "original-free" | "future-priced" };

export function filterCourses(courses: Course[], filters: CourseFilters) {
  const query = filters.query?.trim().toLowerCase() ?? "";
  return courses.filter((course) => {
    if (filters.topic && filters.topic !== "all" && course.topic !== filters.topic) return false;
    if (filters.level && filters.level !== "all" && course.level.toLowerCase() !== filters.level.toLowerCase()) return false;
    if (filters.access === "original-free" && !course.free) return false;
    if (filters.access === "future-priced" && course.free) return false;
    if (!query) return true;
    return [course.title, course.topic, ...course.tags].some((value) => value.toLowerCase().includes(query));
  });
}
