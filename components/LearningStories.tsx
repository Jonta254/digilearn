import Image from "next/image";
import { COURSE_IMAGE_ATTRIBUTIONS } from "@/lib/image-attributions";

const stories = [
  { id:"collaborative-learning-pexels-5940713", label:"Learn with feedback", title:"Review work with another person", body:"Explain the decision, show the evidence, and use specific feedback to improve the next version." },
  { id:"finance-workspace-pexels-6694492", label:"Work with evidence", title:"Keep calculations reviewable", body:"Preserve assumptions, source data and checks so another person can reproduce the result." },
  { id:"health-data-review-pexels-3881422", label:"Use professional judgement", title:"Apply digital skills responsibly", body:"Treat privacy, safety and human oversight as part of the work—not as an afterthought." },
];

export function LearningStories() {
  return <section className="home-section learning-stories" aria-labelledby="stories-title"><div className="section-heading"><div><p className="eyebrow">Learning in practice</p><h2 id="stories-title">Skills become credible when the work can be reviewed.</h2><p className="section-intro">Real professional settings connect tools with evidence, feedback and responsibility.</p></div></div><div className="story-grid">{stories.map((story) => { const image=COURSE_IMAGE_ATTRIBUTIONS.find((item)=>item.id===story.id)!; return <article key={story.id}><figure><Image src={image.file} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 33vw"/><figcaption>Photo: <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.creator} / {image.source}</a></figcaption></figure><div><span>{story.label}</span><h3>{story.title}</h3><p>{story.body}</p></div></article>; })}</div></section>;
}
