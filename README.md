# DigiLearn

DigiLearn is a Next.js learning application for practical digital skills. It contains 72 stable courses, 864 structured lessons, 864 lesson visuals, printable guides, eight practice decks, deterministic progress and personal notes.

All lessons currently use the centralized `open-preview` policy. No future price is presented until product scope, quality review, currency, tax, refund and entitlement policies are approved.

## Requirements and installation

Use Node.js 20.9 or newer.

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
npm run verify:payments
npm run build
npm run verify
npm audit
```

`npm run verify` runs linting, TypeScript, tests, content validation, the payment-freeze check and a production build. The GitHub Actions workflow runs the same checks after a clean cached installation on pushes and pull requests.

Before committing, run `npm run verify`, `npm audit` and `git diff --check`. No intrusive Git hook is installed.

## Application architecture

```text
app/courses/courses.ts          catalogue metadata and stable course IDs
lib/course-library.ts           lazy selected-course curriculum assembly
lib/editorial/topic-content.ts  subject concepts and authoritative sources
lib/learning-types.ts           course, lesson, visual and guide contracts
lib/learning-storage.ts         bounded progress and note parsing
lib/practice-storage.ts         bounded practice-state parsing
lib/local-profile.ts            browser-local profile migration and parsing
lib/access-policy.ts            centralized open-preview policy
components/LessonReader.tsx     active lesson workspace
components/SubjectDiagram.tsx   lightweight SVG diagram renderer
components/BrandLogo.tsx        shared application brand
scripts/validate-content.ts     editorial integrity validation
```

Catalogue and search routes import metadata only. The dashboard receives course metadata and lightweight lesson IDs. Lesson routes receive one active manuscript plus navigation metadata. Printable guides assemble only the selected course at runtime. Scripts and tests can explicitly call `getAllCurricula()` when a complete-library audit is required.

## Adding or reviewing learning content

Course IDs and existing lesson IDs are compatibility contracts.

1. Add catalogue metadata to `app/courses/courses.ts`.
2. Add or review topic concepts and sources in `lib/editorial/topic-content.ts`.
3. Keep explanations, examples, activities, checks and practical outcomes aligned.
4. Run `npm run validate:content` and `npm run test`.
5. Inspect lesson, guide and print layouts at small and large viewports.

Use `SubjectDiagram` for a meaningful flow, cycle, comparison, layer, timeline or matrix. Each visual requires a unique ID, useful title, description, labels and caption.

Licensed photographs must include a verified source page, creator, licence, local optimized file, intrinsic dimensions, accurate alt text and a caption. DigiLearn currently ships no third-party photography and makes no unverified licence claims.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the content-review, visual-attribution and deployment checklists.

## Brand and application assets

The original DigiLearn mark combines open pages with an ascending three-step path. Vector masters, light/dark/monochrome variants, minimum-size rules and clear-space guidance are documented in [docs/BRAND.md](docs/BRAND.md).

Favicon, Apple touch, 192px, 512px, maskable and profile images are derived from the same symbol. Open Graph and Twitter images are generated through Next.js metadata routes, including course-specific titles without generating hundreds of raster files.

## Browser-local records and security boundary

Notes, progress, practice state and profiles stay in the current browser. They do not synchronize, receive cloud backup or provide server authorization. Clearing site data can remove them.

The optional device profile stores only a display name and local identifier. It collects no email or password and is never treated as authentication or authorization.

The exact protected and future-backend boundaries are documented in [docs/SECURITY_BOUNDARIES.md](docs/SECURITY_BOUNDARIES.md). Do not claim cloud accounts, recovery, tamper-resistant progress or production authorization until an explicitly approved backend is introduced.

## Payment readiness boundary

The application currently runs in `open-preview` mode and contains no payment initiation, callback, status or entitlement routes. The former M-Pesa implementation and legacy paywall have been removed. `npm run verify:payments` prevents those production surfaces from returning accidentally. Paystack must not be added until server-backed identity, durable entitlements, webhook verification, reconciliation and an authorized pricing policy are designed and reviewed.

```bash
npm run verify:payments
```

No launch price is configured. Pricing requires an authorized product definition, currency and tax policy, refund terms, durable entitlements and supported payment provider.

## Deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
2. Run `npm ci && npm run verify && npm audit`.
3. Verify `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, icons and social previews.
4. Confirm production response security headers and a clean browser console.
5. Configure hosting-level availability/error monitoring; no third-party learner tracking is bundled.
6. Never place payment credentials or other secrets in `NEXT_PUBLIC_*` variables.
7. Do not activate payment routes without a separately authorized payment review.

## Known limitations

- Profiles, notes, progress and practice state are device-local and can be lost.
- There is no server account recovery, synchronization, authorization or multi-device support.
- There are no certificates, instructor reviews, ratings, learner counts or analytics claims.
- Offline course availability is not claimed; already rendered content may remain visible only by normal browser behavior.
- A production deployment must provide its canonical URL and external monitoring.
- International pricing and payment methods remain intentionally deferred.
