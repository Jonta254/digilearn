# DigiLearn production security boundaries

## Protected now

- Browser output is rendered through React; lesson and note content is not injected as HTML.
- Production responses use a restrictive Content Security Policy, clickjacking protection, MIME-sniffing protection, referrer controls and a limited permissions policy.
- Course, lesson, note, progress and external-reference values are schema-checked and size-limited before use.
- Corrupt or unavailable browser storage falls back to an empty local state instead of crashing a route.
- Local profile sessions exclude stored credential material.
- CI verifies the frozen payment implementation against commit `0c47f6d`.
- Dependencies are audited and the production build is verified.

## Browser-local boundary

Profiles, passwords, notes, progress and practice state are not backed by a server. Browser storage is readable by scripts executing on the same origin and can be erased by the learner or browser. DigiLearn therefore does not claim secure authentication, account recovery, synchronization, tamper resistance, access control or backup.

Legacy locally encoded passwords remain accepted only to avoid locking out an existing browser profile. After a successful legacy sign-in, DigiLearn replaces that value with a salted PBKDF2 verifier and removes credential data from the active session. This reduces accidental disclosure but is not equivalent to server-side authentication.

## Requires a future authorized backend

- Server-managed sessions using secure, HttpOnly cookies
- Rate limiting, abuse controls and verified email ownership
- Password reset and modern server-side password hashing
- Authorization for learner records and paid access
- Encrypted backups, synchronization, retention and deletion workflows
- Central monitoring, alerting and incident response
- Production payment activation and internationally supported pricing
