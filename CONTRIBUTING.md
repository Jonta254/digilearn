# Contributing to DigiLearn

Use Node.js 20.9 or newer and install with `npm ci`. Before committing, run `npm run verify` and `npm audit`.

## Content authoring

1. Add or update stable catalogue metadata in `app/courses/courses.ts`.
2. Add topic concepts and authoritative sources in `lib/editorial/topic-content.ts`.
3. Preserve existing course, module and lesson IDs.
4. Give each lesson a clear explanation, realistic example, bounded activity, assessment, summary, diagram specification and at least two authoritative sources.
5. Run `npm run validate:content`; errors identify the course and lesson.

## Visual review

- Reuse `SubjectDiagram` for semantic diagrams and provide a specific title, description, labels and caption.
- Photographs must have a verified source page, creator, licence, local optimized asset, dimensions, alt text and caption.
- Do not add decorative images that compete with lesson content.
- Check 320px, 768px, 1440px and 2560px layouts plus print preview.

## Review checklist

- [ ] Learning objective, explanation, example and assessment agree.
- [ ] Activity produces a reviewable output and includes success criteria.
- [ ] Claims are supported by current authoritative sources.
- [ ] IDs, routes, open-preview access and localStorage keys remain compatible.
- [ ] Keyboard focus, reduced motion, contrast and empty/error states are checked.
- [ ] Protected payment files match commit `0c47f6d`.
- [ ] No secrets, private notes or credentials are logged.

## Deployment checklist

- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- Run `npm ci && npm run verify && npm audit`.
- Verify response security headers and metadata files.
- Confirm no payment request or entitlement mutation occurs during open-preview smoke tests.
- Configure external monitoring at the hosting layer; none is bundled in this browser-local stage.
- Do not enable payments without a separately authorized payment review.
