# DigiLearn

DigiLearn is a Next.js learning application for practical digital skills. Its catalogue contains 72 stable courses across 11 topic areas, with structured lessons, knowledge checks, practice decks, printable material, device-local notes and deterministic progress.

## Current product state

- All 72 courses are available through the existing `/courses/[id]` URLs.
- `LEARNING_ACCESS_MODE` is `open-preview`: every lesson is currently accessible without payment.
- Previously paid courses retain the future price from `lib/pricing.ts`.
- Opening learning content does not initiate M-Pesa or create a payment confirmation.
- Eight existing Leitner-style practice decks and their saved browser data are preserved.
- Notes and progress are stored on the current device, not synchronized to a server.
- Login and signup remain a browser-local prototype. There is no password recovery or production account security yet.

## Learning architecture

```text
app/courses/courses.ts       catalogue metadata and stable course IDs
lib/course-library.ts        stable curriculum registry and lesson assembly
lib/editorial/topic-content.ts subject-specific concept briefs and authoritative sources
lib/learning-types.ts        course, module, lesson, check and guide types
lib/access-policy.ts         temporary open-learning policy
lib/learning-storage.ts      versioned progress and note parsing
components/LessonReader.tsx  responsive lesson workspace
components/NoteEditor.tsx    personal device-local notes
components/SubjectDiagram.tsx accessible data-driven SVG diagram library
scripts/validate-content.ts  content integrity checks
```

Each course is registered in `COURSE_LIBRARY`; there is no missing-course fallback curriculum. Durations are calculated from lesson durations. The content validator checks course count, stable and unique IDs, substantive lesson sections, duplicated editorial fields, structured source URLs, unique visual specifications, practical outcomes, placeholder language, artwork metadata, pricing consistency and duration validity. The client lesson workspace receives one active manuscript plus lightweight outline metadata; the other lesson manuscripts remain server-side.

## Visual and attribution policy

Current course artwork uses original gradient/icon compositions already present in the catalogue. Every lesson has a concept-specific visual specification rendered through an original responsive SVG diagram library, with accessible titles, descriptions and captions. No third-party photographs are currently bundled, so there are no unrecorded photographic licence claims. Future photographs must include a verified source page, creator, licence, local optimized asset, useful caption and accurate alt text.

## Notes, progress and guides

Personal notes are keyed by stable course and lesson IDs, saved explicitly in localStorage, restored safely and removable with confirmation. The interface states "Saved on this device" and never claims cloud sync. Progress derives from opened lessons, completed lessons and completed knowledge checks; no random advancement is used.

Use the lesson reader's **Print or save as PDF** action for printable lesson material and personal notes. Print CSS removes navigation and prevents key learning figures from clipping. DigiLearn does not offer a fake PDF download.

## Payment freeze and future pricing

M-Pesa service code, callback routes, credentials, environment variables, payment-status storage and pricing logic are frozen during this product stage. `lib/pricing.ts` remains the only price source. International dollar pricing is not configured; adding it requires an explicit currency/pricing source and supported payment provider in a future payment stage.

## Development

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run validate:content
npm run build
npm run verify
```

`npm run verify` runs linting, TypeScript, focused tests, content validation and a production build.

## Deployment

Build with `npm run build` and deploy the resulting Next.js application to a compatible Node.js host. Supply payment environment variables only during an explicitly authorized future payment stage. Never commit credentials.

## Known limitations

- Profiles, notes and progress are device-local and can be lost when browser data is cleared.
- No backend account recovery, synchronization or multi-device support exists.
- No certificates, instructor review, ratings, enrolment totals or learning analytics are claimed.
- Current lesson visuals are original diagrams; an attributed photography library has not yet been introduced.
- International pricing and payment methods are intentionally deferred.
