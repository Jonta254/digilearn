import type { Course } from "@/app/courses/courses";
import { coverAssetFor } from "@/lib/course-assets";

function CodeOutput({ course }: { course: Course }) {
  const language = course.id.includes("python") ? "python" : course.id.includes("sql") ? "sql" : "typescript";
  const line = language === "python" ? "total = sum(valid_orders)" : language === "sql" ? "SELECT region, SUM(total)" : "const result: Report = validate(data)";
  return <div className="cover-code"><div><span>{course.id}.{language === "typescript" ? "ts" : language}</span><code>{line}</code><code>assert(result.status === &quot;ready&quot;)</code></div><div><span>Validated result</span><strong>Ready</strong><small>0 errors · 3 checks</small></div></div>;
}

function DataAnalysis({ course }: { course: Course }) {
  const asset = coverAssetFor(course);
  return <div className="cover-analysis"><div className="mini-table"><span>Period</span><span>Value</span>{asset.values.map((value, index) => <span className="mini-row" key={index}><b>Q{index + 1}</b><em>{value}</em></span>)}</div><div className="mini-chart" aria-hidden="true">{asset.values.map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</div></div>;
}

function ReviewWorkflow({ course }: { course: Course }) {
  const { labels } = coverAssetFor(course);
  return <div className="cover-review"><div><small>Source</small><strong>{labels[0]}</strong></div><span>Checked</span><div><small>Human review</small><strong>{labels[1]}</strong></div><span>Verified</span><div><small>Approved output</small><strong>{labels[2]}</strong></div></div>;
}

function ProfessionalDocument({ course }: { course: Course }) {
  const { values } = coverAssetFor(course);
  return <div className="cover-document-real"><header><span>Northstar Studio · fictional</span><b>PROJECT BRIEF</b></header><p>{course.tags.slice(0, 2).join(" / ")}</p><dl><div><dt>Scope</dt><dd>{values[0]} hours</dd></div><div><dt>Review</dt><dd>Complete</dd></div><div><dt>Budget</dt><dd>KES {(values[1] * 1000).toLocaleString("en-KE")}</dd></div></dl></div>;
}

function SecurityReview({ course }: { course: Course }) {
  const labels = coverAssetFor(course).labels;
  return <div className="cover-security-real"><header>Protection review</header>{labels.map((label, index) => <div key={label}><i aria-hidden="true">{index < 2 ? "PASS" : "CHECK"}</i><span>{label}</span><small>{index < 2 ? "Configured" : "Review evidence"}</small></div>)}</div>;
}

function EvidenceBrief({ course }: { course: Course }) {
  const labels = coverAssetFor(course).labels;
  return <div className="cover-brief"><header>EVIDENCE BRIEF · FICTIONAL CASE</header><div><small>Question</small><strong>{course.title}</strong></div><div className="brief-columns"><p><b>Source</b>{labels[0]}</p><p><b>Finding</b>{labels[1]}</p><p><b>Action</b>{labels[2]}</p></div></div>;
}

export function CourseCover({ course, priority = false }: { course: Course; priority?: boolean }) {
  const asset = coverAssetFor(course);
  return <figure className={`course-cover authentic-cover visual-${asset.visualType}`} aria-label={asset.alt} data-asset-id={asset.assetId} data-priority={priority ? "true" : undefined}>
    {asset.visualType === "code-output" ? <CodeOutput course={course} /> : asset.visualType === "data-analysis" ? <DataAnalysis course={course} /> : asset.visualType === "review-workflow" ? <ReviewWorkflow course={course} /> : asset.visualType === "professional-document" ? <ProfessionalDocument course={course} /> : asset.visualType === "security-review" ? <SecurityReview course={course} /> : <EvidenceBrief course={course} />}
    <figcaption className="sr-only">{asset.caption}</figcaption>
  </figure>;
}
