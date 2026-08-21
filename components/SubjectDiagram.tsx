import type { LessonVisual } from "@/lib/learning-types";

function Nodes({ visual, arrowId }: { visual: LessonVisual; arrowId: string }) {
  if (visual.kind === "comparison") return <>{visual.labels.map((label,index)=><g key={label}><rect x={40+index*225} y={index===1?55:75} width="190" height={index===1?"110":"80"} rx="10"/><text x={135+index*225} y={index===1?115:120} textAnchor="middle">{label}</text></g>)}</>;
  if (visual.kind === "layers") return <>{visual.labels.map((label,index)=><g key={label}><rect x={100+index*45} y={35+index*50} width={520-index*90} height="42" rx="7"/><text x="360" y={62+index*50} textAnchor="middle">{label}</text></g>)}</>;
  if (visual.kind === "cycle") return <>{visual.labels.map((label,index)=>{const positions=[[360,45],[565,150],[155,150]];const [x,y]=positions[index];return <g key={label}><circle cx={x} cy={y} r="54"/><text x={x} y={y+5} textAnchor="middle">{label}</text></g>})}<path d="M405 65Q525 80 540 120M520 180Q360 220 205 180M180 120Q210 70 315 60" markerEnd={`url(#${arrowId})`}/></>;
  if (visual.kind === "timeline") return <>{visual.labels.map((label,index)=><g key={label}><circle cx={130+index*230} cy="110" r="38"/><text x={130+index*230} y="115" textAnchor="middle">{index+1}</text><text x={130+index*230} y="175" textAnchor="middle">{label}</text></g>)}<path d="M168 110H322M398 110H552" markerEnd={`url(#${arrowId})`}/></>;
  if (visual.kind === "matrix") return <><rect x="115" y="35" width="490" height="150" rx="8"/><path d="M360 35V185M115 110H605"/>{visual.labels.map((label,index)=><text key={label} x={[235,485,235][index]} y={[80,80,155][index]} textAnchor="middle">{label}</text>)}</>;
  return <>{visual.labels.map((label,index)=><g key={label}><rect x={25+index*230} y="70" width="190" height="80" rx="10"/><text x={120+index*230} y="115" textAnchor="middle">{label}</text>{index<2?<path d={`M${215+index*230} 110H${245+index*230}`} markerEnd={`url(#${arrowId})`}/>:null}</g>)}</>;
}

export function SubjectDiagram({ visual }: { visual: LessonVisual }) {
  const arrowId = `${visual.id}-arrow`;
  return <figure className={`lesson-figure diagram-${visual.kind}`}>
    <svg viewBox="0 0 720 220" role="img" aria-labelledby={`${visual.id}-title ${visual.id}-desc`}>
      <title id={`${visual.id}-title`}>{visual.title}</title><desc id={`${visual.id}-desc`}>{visual.description}</desc>
      <defs><marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs>
      <Nodes visual={visual} arrowId={arrowId}/>
    </svg>
    <figcaption><strong>{visual.title}.</strong> {visual.caption}</figcaption>
  </figure>;
}
