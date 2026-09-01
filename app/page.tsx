import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "./courses/courses";
import { CourseCard } from "@/components/CourseCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { PATHWAYS } from "@/lib/course-editorial";
import { HeroVisual } from "@/components/HeroVisual";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const featuredCourseIds = ["html-css", "typescript", "python-ai", "security-fundamentals", "chatgpt-mastery", "financial-modelling"];

export default function HomePage() {
  return <><SiteHeader /><main id="main-content">
    <section className="editorial-hero problem-hero hero-rebuilt">
      <div className="hero-copy">
        <p className="eyebrow hero-kicker">Practical digital learning for real work</p>
        <h1>Learn it. Build it. <span>Show what you can do.</span></h1>
        <p className="hero-lead">Go beyond watching tutorials. Follow structured lessons, practise with realistic files, and finish projects you can explain to an employer, client or customer.</p>
        <div className="hero-actions">
          <Link className="button primary inline-button hero-primary" href="/courses">Explore 72 practical courses <span aria-hidden="true">→</span></Link>
          <a className="hero-secondary" href="#learning-goals">Find your learning path</a>
        </div>
        <ul className="hero-trust" aria-label="DigiLearn platform highlights">
          <li><strong>864</strong><span>guided lessons</span></li>
          <li><strong>72</strong><span>structured course drafts</span></li>
          <li><strong>Open</strong><span>access right now</span></li>
        </ul>
        <p className="hero-honesty"><span aria-hidden="true">●</span> No card required. Progress stays on this device.</p>
      </div>
      <HeroVisual />
    </section>

    <section className="outcome-ribbon" aria-label="Skills you can build">
      <span>Build websites</span><span>Use AI responsibly</span><span>Analyse data</span><span>Automate work</span><span>Protect systems</span><span>Grow a business</span>
    </section>

    <section id="learning-goals" className="home-section goal-section">
      <div className="section-heading"><div><p className="eyebrow">Start with your outcome</p><h2>What would you like to achieve?</h2><p className="section-intro">Choose a goal and see the courses that move you from explanation to finished work.</p></div></div>
      <div className="goal-grid">{PATHWAYS.map((pathway, index) => <Link key={pathway.id} href={`/courses?pathway=${pathway.id}`}><small>{String(index + 1).padStart(2, "0")}</small><h3>{pathway.title}</h3><p>{pathway.problem}</p><span>{pathway.courseIds.length} matched courses <b aria-hidden="true">→</b></span></Link>)}</div>
    </section>

    <section className="home-strip proof-strip" aria-label="Learning evidence"><div><strong>Working code</strong><span>with expected output</span></div><div><strong>Practical files</strong><span>built from safe examples</span></div><div><strong>Knowledge checks</strong><span>linked to each lesson</span></div><div><strong>Local progress</strong><span>honestly stored on this device</span></div></section>

    <section className="home-section featured-section"><div className="section-heading"><div><p className="eyebrow">High-value starting points</p><h2>Courses that lead to demonstrable work</h2><p className="section-intro">Recognizable tools, structured practice, and a concrete project at the finish.</p></div><Link href="/courses">View all courses <span aria-hidden="true">→</span></Link></div><div className="editorial-course-grid">{featuredCourseIds.map((id) => <CourseCard key={id} course={COURSES.find((course) => course.id === id)!} />)}</div></section>

    <section className="learning-method"><div><p className="eyebrow">A clearer way to learn</p><h2>From curiosity to credible work.</h2><p>DigiLearn connects every explanation to an example, check or practical output—so progress means more than finishing a video.</p><Link className="method-link" href="/practice">See how practice works <span aria-hidden="true">→</span></Link></div><ol><li><strong>Choose a goal</strong><span>Start from the capability you need, not an endless tool list.</span></li><li><strong>Study in context</strong><span>See code, documents, data and decisions used in realistic situations.</span></li><li><strong>Build evidence</strong><span>Complete a practical output and compare it with clear success criteria.</span></li><li><strong>Keep improving</strong><span>Use checks, notes and saved progress to return with purpose.</span></li></ol></section>

    <section className="final-cta"><div><p className="eyebrow">Start where you are</p><h2>Your next useful skill can become your next finished project.</h2><p>Browse the full catalogue, choose a clear outcome, and begin with the first practical lesson.</p></div><div><Link className="button primary inline-button" href="/courses">Choose a course</Link><Link href="/dashboard">View your dashboard</Link></div></section>

    <section className="local-first-banner"><p className="eyebrow">Open-access stage</p><h2>Learn every lesson without starting a payment.</h2><p>All courses are currently open. Future KES prices remain visible for transparency. Notes, progress and profiles stay in this browser; they do not synchronize or receive cloud backup, and clearing browser data can remove them.</p><Link href="/dashboard">Review local learning data</Link></section>
  </main><SiteFooter /></>;
}
