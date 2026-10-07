# Learning enrichment — 7 October 2026

## Delivered

- Clearer home and course introduction copy, with accurate local-backup guidance.
- Credited, locally bundled Kampus Production photograph replaces generated hero art.
- Browser-rendered HTML/CSS example replaces illustrative lesson artwork. Its width control demonstrates grid reflow and its code remains selectable.
- Practical troubleshooting across all eleven topic families, with cause, corrective action and observable success conditions. SQL receives database-specific guidance.
- Verified companion video pages for HTML/CSS, Python, SQL and neural networks. Links retain original-provider attribution and include independent practice prompts.
- Python quantity-validation and SQL left-join lessons now include runnable fixtures, expected-result tables, specific questions, useful error explanations and matching diagrams.
- Updated Python and SQL A4 workbooks; existing guide generation remains the source of truth.
- Knowledge-check state resets when the lesson changes.
- Responsive support panels, focus outlines, code/table scrolling and mobile lesson controls.
- HTML/CSS catalogue duration corrected to six hours to match its 360-minute curriculum.

## Source record

Pages were checked on 7 October 2026. Checking a source is distinct from human subject-matter review.

- [Python: errors and exceptions](https://docs.python.org/3/tutorial/errors.html): narrow exception handling and conversion errors.
- [PostgreSQL: joins between tables](https://www.postgresql.org/docs/current/tutorial-join.html): preserving unmatched rows with a left join.
- [MDN: min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/min-width): grid and flex intrinsic sizing.
- [CS50 Python](https://cs50.harvard.edu/python/): free OpenCourseWare lectures; optional credentials are separate.
- [CS50 SQL](https://cs50.harvard.edu/sql/): free OpenCourseWare lectures; initial examples use SQLite.
- [Khan Academy HTML/CSS](https://www.khanacademy.org/computing/html-css): companion video and coding lessons.
- [3Blue1Brown neural networks](https://www.3blue1brown.com/lessons/neural-networks/): visual conceptual companion.
- [Kampus Production photograph](https://www.pexels.com/photo/attentive-young-black-groupmates-using-laptop-while-preparing-for-exams-with-anonymous-teacher-5940713/) and [Pexels licence](https://www.pexels.com/legal-pages/license/): existing local image verified against its original source. No endorsement is implied.

## Verification

Lint, TypeScript, the 29 existing tests, content validation and the payment guard passed. The production build passed outside the Windows filesystem sandbox; sandboxed Turbopack and Webpack builds hit access errors in generated output.

The built homepage and HTML/CSS lesson were checked at 320, 390, 768 and 1440 CSS pixels with no page-level horizontal overflow. Homepage images loaded. Live layout toggling, quiz feedback, completion, next-lesson reset and mobile outline opening/closing passed; the inspected browser console reported no errors.

The published Python example passed seven input cases. The SQL fixture and two diagnostic variations passed in SQLite; PostgreSQL syntax was checked against primary documentation, rather than executed against a PostgreSQL instance. The updated workbook pages were rendered and visually checked.

## Remaining editorial scope

This update adds topic-wide support and rewrites the Python Fundamentals and SQL for Data Analysis courses into 24 practical lessons. It does not constitute a full rewrite or expert review of all 864 manuscripts. Existing structured-draft labels remain accurate. External video playback and third-party page availability remain controlled by their providers. Progress and notes remain browser-local; paid entitlement and cloud synchronization are outside this release.

## Continued enrichment

Both foundation courses now have tool-specific sequences, runnable examples, expected outputs, matching diagrams, boundary exercises and concept-specific questions. Their original lesson IDs remain unchanged so bookmarks, notes and progress continue to resolve. Course introductions, outcomes, glossaries and projects match the new sequence. Practice downloads now provide fictional stock CSV data and a read-only customer-report SQL fixture.

The source review covers the Python tutorial, language reference, built-in types/functions, CSV, JSON, classes and unittest documentation, and the PostgreSQL documentation on queries, NULL, joins, grouping, CASE, CTEs and window functions. The links and review dates appear in the courses and workbooks.

`scripts/check-foundation-examples.py` executes all 24 published examples, checks their outputs, tests invalid Python records and verifies that the published boundary test catches a deliberate regression. SQL execution uses SQLite; a live PostgreSQL instance has not been tested. Both downloadable fixtures also passed execution/parsing checks.

The two A4 workbooks include the new objectives and projects, keep lesson panels intact, and place their expanded sources on dedicated reference pages. The PDF check allows 14–16 pages to accommodate references rather than forcing a fixed page count.

Final verification passed: lint, TypeScript, 29 tests, content validation, payment guard and the production build. The new Python and SQL lessons were checked at 320, 390, 768 and 1440 CSS pixels without page-level overflow. Both quizzes returned the correct explanation; the Python next-lesson check confirmed answer-state reset. No errors appeared in the inspected browser console. The rebuilt Python course page links the stock CSV, and workbook pages were rendered and visually reviewed after pagination fixes.
