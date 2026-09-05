import type { LessonVisual } from "@/lib/learning-types";

const KIND_LABELS: Record<LessonVisual["kind"], string> = {
  flow: "Process flow", cycle: "Continuous cycle", comparison: "Side-by-side comparison",
  layers: "Nested structure", timeline: "Ordered timeline", matrix: "Decision matrix",
};

function DiagramIcon({ kind }: { kind: LessonVisual["kind"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {kind === "layers" ? <><path {...common} d="m12 3 9 5-9 5-9-5 9-5Z"/><path {...common} d="m3 12 9 5 9-5M3 16l9 5 9-5"/></> : null}
    {kind === "cycle" ? <><path {...common} d="M20 11a8 8 0 0 0-14.9-4L3 10"/><path {...common} d="M3 4v6h6M4 13a8 8 0 0 0 14.9 4l2.1-3"/><path {...common} d="M21 20v-6h-6"/></> : null}
    {kind === "comparison" ? <><path {...common} d="M12 3v18M5 7h14M7 7l-4 7h8L7 7Zm10 0-4 7h8l-4-7Z"/></> : null}
    {kind === "timeline" ? <><circle {...common} cx="12" cy="12" r="9"/><path {...common} d="M12 7v5l3 2"/></> : null}
    {kind === "matrix" ? <><rect {...common} x="3" y="3" width="18" height="18" rx="2"/><path {...common} d="M12 3v18M3 12h18"/><path {...common} d="m15.5 16 1.5 1.5 3-3"/></> : null}
    {kind === "flow" ? <><circle {...common} cx="5" cy="12" r="2.5"/><circle {...common} cx="19" cy="12" r="2.5"/><path {...common} d="M7.5 12h8M13 9l3 3-3 3"/></> : null}
  </svg>;
}

export function SubjectDiagram({ visual }: { visual: LessonVisual }) {
  const titleId = `${visual.id}-title`;
  const summaryId = `${visual.id}-summary`;
  const descriptionId = `${visual.id}-description`;
  return <figure className={`lesson-figure diagram-${visual.kind}`}>
    <div className="diagram-heading">
      <div className="diagram-kicker"><span className="diagram-kind-icon"><DiagramIcon kind={visual.kind}/></span><span><span className="eyebrow">Instructional figure</span><small>{KIND_LABELS[visual.kind]}</small></span></div>
      <h2 id={titleId}>{visual.title}</h2>
      <p id={summaryId} className="diagram-summary">{visual.description}</p>
    </div>
    <div className="semantic-diagram" role="list" aria-labelledby={titleId} aria-describedby={`${summaryId} ${descriptionId}`}>
      {visual.items.map((item, index) => <div className="diagram-step-wrap" role="listitem" key={`${item.label}-${index}`}>
        <div className="diagram-node"><span className="diagram-number" aria-hidden="true">{index + 1}</span><strong>{item.label}</strong><p>{item.detail}</p></div>
        {index < visual.items.length - 1 ? <div className="diagram-connector" aria-label={`${item.label} ${visual.connections?.[index] ?? "leads to"} ${visual.items[index + 1].label}`}><span>{visual.connections?.[index] ?? "leads to"}</span><svg viewBox="0 0 44 16" aria-hidden="true"><path d="M1 8h38M34 3l6 5-6 5"/></svg></div> : null}
      </div>)}
    </div>
    {visual.kind === "cycle" ? <p className="diagram-loop"><DiagramIcon kind="cycle"/> Review the evidence, adjust the method, and repeat.</p> : null}
    <figcaption id={descriptionId}><strong>Takeaway:</strong> {visual.takeaway} <span>{visual.caption}</span></figcaption>
  </figure>;
}
