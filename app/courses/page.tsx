import type { Metadata } from "next";
import { COURSES } from "./courses";
import { CourseCatalogue } from "@/components/CourseCatalogue";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Course catalogue", description: "Explore all 72 DigiLearn courses by topic, skill and level. Every course is currently open for learning.", alternates: { canonical: "/courses" } };

export default function CoursesPage() {
  return <><SiteHeader /><main id="main-content" className="catalogue-page"><header className="editorial-hero compact"><p className="eyebrow">Open learning library</p><h1>Choose the outcome you need.</h1><p>Start with a learning goal, project, skill or tool. Every course leads to a practical output and remains open during this learning-access stage; future pricing is shown quietly for transparency.</p></header><CourseCatalogue courses={COURSES} /></main><SiteFooter /></>;
}
