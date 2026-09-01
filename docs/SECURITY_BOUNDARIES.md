# DigiLearn production security boundaries

## Protected now

- Browser output is rendered through React; lesson and note content is not injected as HTML.
- Production responses use a restrictive Content Security Policy, clickjacking protection, MIME-sniffing protection, referrer controls and a limited permissions policy.
- Course, lesson, note, progress and external-reference values are schema-checked and size-limited before use.
- Corrupt or unavailable browser storage falls back to an empty local state instead of crashing a route.
- Device profiles contain only a local identifier, display name and creation date.
- CI verifies the frozen payment implementation against commit `0c47f6d`.
- Dependencies are audited and the production build is verified.

## Browser-local boundary

Device profiles, notes, progress and practice state are not backed by a server. Browser storage is readable by scripts executing on the same origin and can be erased by the learner or browser. DigiLearn therefore does not claim secure authentication, account recovery, synchronization, tamper resistance, access control or backup.

Legacy profile records are reduced on read to a local identifier, display name and creation date. Email, password, credential, plan and entitlement-like fields are not retained by the active profile model.

## Requires a future authorized backend

- Server-managed sessions using secure, HttpOnly cookies
- Rate limiting, abuse controls and verified email ownership
- Password reset and modern server-side password hashing
- Authorization for learner records and paid access
- Encrypted backups, synchronization, retention and deletion workflows
- Central monitoring, alerting and incident response
- Production payment activation and internationally supported pricing
