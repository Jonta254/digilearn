import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES } from "../../courses";
import { getCurriculum } from "@/lib/course-library";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { PrintButton } from "@/components/PrintButton";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() { return COURSES.map((course) => ({ id: course.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = COURSES.find((item) => item.id === id);
  return { title: course ? `${course.title} study guide` : "Guide not found", description: course ? `Printable DigiLearn study guide for ${course.title}.` : undefined };
}

export default async function CourseGuidePage({ params }: Props) {
  const { id } = await params;
  const course = COURSES.find((item) => item.id === id);
  const curriculum = getCurriculum(id);
  if (!course || !curriculum) notFound();
  return <><SiteHeader /><main id="main-content" className="course-guide"><header><p className="eyebrow">Curriculum-derived study guide</p><h1>{course.title}</h1><p>{curriculum.overview}</p><div className="guide-actions"><Link href={`/courses/${course.id}`} className="button primary inline-button">Open lesson reader</Link><PrintButton /></div></header><section><h2>Learning outcomes</h2><ul>{curriculum.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></section><section><h2>Course outline and revision prompts</h2>{curriculum.modules.map((module, index) => <article className="guide-module" key={module.id}><p className="eyebrow">Module {index + 1}</p><h3>{module.title}</h3><p>{module.summary}</p><table><thead><tr><th>Lesson</th><th>Key terms</th><th>Revision question</th></tr></thead><tbody>{module.lessons.map((lesson) => <tr key={lesson.id}><td>{lesson.title}</td><td>{lesson.keyTerms.join(", ")}</td><td>{lesson.check.prompt}</td></tr>)}</tbody></table></article>)}</section><section><h2>Practical completion checklist</h2><ul className="guide-checklist"><li>Explain the main concepts without relying on copied definitions.</li><li>Complete each lesson activity and keep evidence of the result.</li><li>Review common mistakes and correct one weak example.</li><li>Complete the final outcome: {curriculum.finalOutcome}</li></ul></section><section><h2>Glossary</h2><dl className="guide-glossary">{Object.entries(curriculum.glossary).map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section><section><h2>References</h2><ul>{curriculum.references.map((reference) => <li key={reference}>{reference}</li>)}</ul><p className="guide-disclaimer">This guide is generated from DigiLearn course material. Product versions, regulations and professional standards can change; consult the linked authoritative source before applying version-sensitive guidance.</p></section></main><SiteFooter /></>;
}
