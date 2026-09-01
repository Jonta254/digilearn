# Operations baseline

Before each production release:

1. Run lint, type checking, automated tests, content validation, payment-boundary
   verification and the production build.
2. Exercise the home, catalogue, course, lesson, profile and dashboard flows at narrow
   phone, tablet and desktop widths with keyboard navigation.
3. After deployment, inspect Vercel build and runtime logs for new errors and verify the
   public deployment independently.
4. Record the deployed commit and rollback target.

No third-party browser analytics or session recording is enabled by this baseline.
Adding telemetry transmits visitor data to another service and therefore requires an
explicit privacy decision, documented retention, a data-minimization review and any
consent mechanism required by the deployment's jurisdictions. Server logs must not
include profile names, notes, assessment answers or future payment secrets.
