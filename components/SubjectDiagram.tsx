import type { LessonVisual } from "@/lib/learning-types";

export function SubjectDiagram({ visual }: { visual: LessonVisual }) {
  return <figure className={`lesson-figure diagram-${visual.kind}`}>
    <div className="diagram-heading">
      <span className="eyebrow">Instructional figure</span>
      <h2 id={`${visual.id}-title`}>{visual.title}</h2>
      <p id={`${visual.id}-summary`} className="diagram-summary">{visual.description}</p>
    </div>
    <div className="semantic-diagram" role="group" aria-labelledby={`${visual.id}-title`} aria-describedby={`${visual.id}-summary ${visual.id}-description`}>
      {visual.items.map((item, index) => <div className="diagram-step-wrap" key={`${item.label}-${index}`}>
        <div className="diagram-node">
          <span className="diagram-number">{index + 1}</span>
          <strong>{item.label}</strong>
          <p>{item.detail}</p>
        </div>
        {index < visual.items.length - 1 ? <div className="diagram-connector" aria-hidden="true"><span>{visual.connections?.[index] ?? "leads to"}</span><b>→</b></div> : null}
      </div>)}
    </div>
    <figcaption id={`${visual.id}-description`}><strong>Takeaway:</strong> {visual.takeaway} <span>{visual.caption}</span></figcaption>
  </figure>;
}
