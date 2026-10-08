# Learning flow improvements

- Added section links for objectives, the working method, practice, the knowledge check and notes to every lesson.
- Added a practice-review prompt for recording expected and actual results, boundary cases and a change explanation.
- Made lesson completion reversible without erasing a passed knowledge check. The final lesson links directly to the course assessment.
- Added a practice-note template, unsaved-change status and Markdown download. Saving still uses the existing bounded browser-local note store.
- Displayed each course's existing project self-review questions and strengthened course-plan heading hierarchy.
- Corrected Python troubleshooting to explain tracebacks, expected exception handling and reproducible failing inputs.

Research checked on 8 October 2026: [Python errors and exceptions](https://docs.python.org/3/tutorial/errors.html), [Python CSV reference](https://docs.python.org/3/library/csv.html), [Harvard CS50 Python](https://cs50.harvard.edu/python/) and [Harvard CS50 SQL](https://cs50.harvard.edu/sql/).

This release improves shared learning components across the catalogue. Course review statuses remain accurate: the manuscripts are structured learning drafts rather than certified curricula. The development-only lint dependency audit findings from the preceding release remain unresolved; the production dependency audit is checked separately.

Validation: the complete verification command passed all 29 tests, lint, TypeScript, content validation, payment guard and the production build. The production audit reported zero vulnerabilities. Browser tests verified completion persistence, reopening, the note template, unsaved status, Markdown file contents and section navigation. Twenty-four layout checks passed across Python/SQL course and lesson screens at widths of 320, 390, 768, 1024, 1440 and 2560 pixels, without detected text clipping. The browser console was clean.
