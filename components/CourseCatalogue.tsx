"use client";
import { useMemo, useState } from "react";
import type { Course } from "@/app/courses/courses";
import { filterCourses } from "@/lib/course-search";
import { CourseCard } from "./CourseCard";

export function CourseCatalogue({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState("all");
  const [access, setAccess] = useState<"all" | "original-free" | "future-priced">("all");
  const topics = useMemo(() => [...new Set(courses.map((course) => course.topic))].sort(), [courses]);
  const filtered = useMemo(() => filterCourses(courses, { query, topic, level, access }), [courses, query, topic, level, access]);
  function reset() { setQuery(""); setTopic("all"); setLevel("all"); setAccess("all"); }
  return <><form className="catalogue-filters" onSubmit={(event) => event.preventDefault()}><label className="search-field"><span>Search courses and skills</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Python, privacy or React" /></label><label><span>Topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">All topics</option>{topics.map((item) => <option key={item} value={item}>{item.replace("-", " ")}</option>)}</select></label><label><span>Level</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label><span>Catalogue status</span><select value={access} onChange={(event) => setAccess(event.target.value as typeof access)}><option value="all">All courses</option><option value="original-free">Originally free</option><option value="future-priced">Future-priced</option></select></label><button type="button" className="button quiet" onClick={reset}>Reset</button></form><div className="catalogue-result"><p aria-live="polite">{filtered.length} of {courses.length} courses</p><span>Every result is currently open for learning.</span></div>{filtered.length ? <div className="editorial-course-grid">{filtered.map((course) => <CourseCard key={course.id} course={course} />)}</div> : <div className="empty-state"><h2>No courses match these filters</h2><p>Try a broader skill, topic or level.</p><button className="button primary" type="button" onClick={reset}>Clear filters</button></div>}</>;
}
