export function LessonFigure({ title, description, labels }: { title: string; description: string; labels: string[] }) {
  return (
    <figure className="lesson-figure">
      <svg viewBox="0 0 720 220" role="img" aria-labelledby="figure-title figure-description">
        <title id="figure-title">{title}</title>
        <desc id="figure-description">{description}</desc>
        <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor"/></marker></defs>
        {labels.map((label, index) => {
          const x = 25 + index * (670 / labels.length);
          const width = Math.max(120, 620 / labels.length);
          return <g key={label}><rect x={x} y="70" width={width} height="80" rx="12" /><text x={x + width / 2} y="112" textAnchor="middle">{label}</text>{index < labels.length - 1 ? <path d={`M${x + width + 8} 110H${x + 670 / labels.length - 8}`} markerEnd="url(#arrow)" /> : null}</g>;
        })}
      </svg>
      <figcaption><strong>{title}.</strong> {description}</figcaption>
    </figure>
  );
}
