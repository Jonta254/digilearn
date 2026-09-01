# Payments readiness gate

DigiLearn does not currently authorize paid access. Learning remains in the explicit `open-preview` mode. The existing browser-local profile, progress, assessment and note records are convenience data, not account or purchase records.

Before integrating Paystack, the platform requires:

1. Server-authenticated learner accounts and recovery.
2. A durable order table containing learner, product, currency, expected amount, provider reference and state.
3. A durable entitlement table granted only after verified server-side payment confirmation.
4. Paystack webhook signature verification by comparing the `x-paystack-signature`
   header with an HMAC SHA-512 digest of the event body, using the server-held secret key.
5. Idempotent webhook processing and uniqueness constraints for provider references.
6. Server-side transaction verification that matches amount, currency, order and customer before fulfillment.
7. Rate limits for checkout creation, verification and support endpoints.
8. Purchase history, receipts, restore-access and reconciliation tools.
9. Refund, cancellation, privacy, retention and failed-but-debited support policies.
10. Sandbox tests for success, failure, abandonment, replay, duplicate webhook, wrong amount and delayed confirmation.

Never store paid entitlements in `localStorage`. Never unlock content solely from a browser redirect or client-reported success.

## Evidence used for this gate

- [Paystack transaction verification](https://paystack.com/docs/payments/verify-payments/)
- [Paystack webhooks and signature validation](https://paystack.com/docs/payments/webhooks/)

These controls are readiness requirements, not evidence that payments are active. No
price, product, Paystack key, checkout endpoint or paid entitlement is configured.
