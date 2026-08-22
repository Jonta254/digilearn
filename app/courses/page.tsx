import type { Metadata } from "next";
import { COURSES } from "./courses";
import { CourseCatalogue } from "@/components/CourseCatalogue";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Course catalogue", description: "Explore all 72 DigiLearn courses by topic, skill and level. Every course is currently open for learning.", alternates: { canonical: "/courses" } };

export default function CoursesPage() {
  return <><SiteHeader /><main id="main-content" className="catalogue-page"><header className="editorial-hero compact"><p className="eyebrow">Open learning library</p><h1>Choose a practical digital skill.</h1><p>Explore {COURSES.length} courses across technology, business, data and public-interest topics. Previously paid courses retain their future price, but every lesson is open during this learning-access period.</p></header><CourseCatalogue courses={COURSES} /></main><SiteFooter /></>;
}
