export default function CourseLoading() {
  return <main className="course-loading" aria-busy="true" aria-live="polite">
    <span className="loading-mark" aria-hidden="true" />
    <p>Preparing your lesson…</p>
    <div className="loading-lines" aria-hidden="true"><span /><span /><span /></div>
  </main>;
}
