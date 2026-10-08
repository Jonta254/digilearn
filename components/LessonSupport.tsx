import { TROUBLESHOOTING, videosForCourse } from "@/lib/lesson-support";

export function LessonSupport({ courseId, topic }: { courseId: string; topic: string }) {
  const supportTopic = courseId === "python-fund" || courseId === "python-ai" ? "python" : courseId === "sql" ? "databases" : topic;
  const help = TROUBLESHOOTING[supportTopic];
  const videos = videosForCourse(courseId);
  return <>
    {help ? <section className="lesson-support" aria-label="Practical troubleshooting"><p className="eyebrow">When you get stuck · {supportTopic === "ai-tools" ? "AI workflows" : supportTopic === "python" ? "Python" : supportTopic}</p><h2>{help.symptom}</h2><dl><div><dt>Find the cause</dt><dd>{help.inspect}</dd></div><div><dt>Try this</dt><dd>{help.action}</dd></div><div><dt>Check the fix</dt><dd>{help.proof}</dd></div></dl><p className="support-note">Use this course-wide example when it fits your task. For a different failure, record the input, expected result, actual result and smallest steps that reproduce it.</p></section> : null}
    {videos.length ? <section className="video-resources" aria-label="Free video lessons"><p className="eyebrow">Watch, pause, practise</p><h2>Free video lessons</h2><p>Choose the chapter that matches your task. Videos open on the original provider’s site; playback uses additional data.</p>{videos.map(resource => <article key={resource.url}><span className="video-provider">{resource.provider}</span><h3><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} <span aria-hidden="true">↗</span></a></h3><p>{resource.purpose}</p><p><strong>Try it yourself:</strong> {resource.task}</p><small>Source checked {resource.reviewed} · Free learning material; optional certificates may cost extra.</small></article>)}</section> : null}
  </>;
}
