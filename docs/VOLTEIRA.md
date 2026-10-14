# Volteira integration contract

No Volteira HTTP endpoints were invented. The website exposes typed **capability requirements**, not an assertion that those URLs currently exist.

## Live: service requests (request forwarding)

This one part is live. After the site saves a request in its own database, it sends the request to Volteira, where it lands in Booking requests marked "From your website". When the customer ticked the text-consent box, Volteira's assistant texts them to collect the details and book the diagnostic visit. Scheduling on this site stays off: `productionAdapterReady` is still `false`.

- **On:** only when `VOLTEIRA_MODE=live` and `VOLTEIRA_API_URL` (https) and `VOLTEIRA_API_KEY` are set (`lib/volteira/forward.ts`, `volteiraConfig`). Otherwise nothing is sent and the site behaves as before.
- **Endpoint:** `POST {VOLTEIRA_API_URL}/api/intake/website`, `Authorization: Bearer <key>`, JSON. The owner makes the key in Volteira under Settings → Integrations → Website request form. It is shown once and can be revoked there. The key alone decides which business the request belongs to.
- **Body:** `reference` (this site's request UUID), `firstName`, `lastName`, `phone`, `email`, `address`, `city`, `postalCode`, `service`, `serviceName`, `description`, `preferredTimes`, `contactMethod`, `smsConsent`, `smsDisclosure` (the exact wording from `config/business.ts`, sent only with consent), `site`.
- **Answers:**
  - **201** `{ requestId, duplicate: false, text: "queued" | "skipped:<reason>" }`;
  - **200** with `duplicate: true` for a resend of the same `reference`. There is still one request, and nothing more is texted;
  - **400/401/413** are refused and never retried;
  - **429/5xx** and network errors are retried up to three attempts with backoff, using the same body and reference.
- **When it runs:** inside `after()` in `app/api/service-requests/route.ts`, before the owner email. The email says "In Volteira ✓" or "Not in Volteira yet: add it by hand", so a request that didn't arrive is never silently lost. The customer's confirmation says "We'll text you in a moment" only when forwarding is on and they agreed to texts.
- **Consent:** Volteira records it with the site's wording as proof and never overrides an earlier STOP.

## Implemented boundary

`lib/volteira/types.ts`: business profile, service catalogue, availability, create/read/reschedule/cancel appointments, service-request creation, AI conversation creation and append.

`lib/volteira/contracts.ts`: customer lookup/create, work orders, estimates and approval, invoices, payment status, outbound communication, approved AI knowledge.

`lib/volteira/client.ts`: fail-closed provider. No components call an external operational system directly. Replace its factory only when a verified adapter is available. Credentials must remain server-only.

`lib/volteira/mock.ts`: explicitly test-only, in-memory state. Does not implement real scheduling rules, calendar calculations, travel, notifications, or production persistence.

## Real service contract requirements

- Authenticate the website as this business, with tenant scoping enforced at Volteira.
- Return authoritative business profile, service pricing, hours, territory, and approved AI knowledge.
- Return timezone-aware availability accounting for technician schedules, existing work, blocked time, service duration, travel, booking notice and horizon.
- Atomically revalidate and create appointments with idempotency keys; return an explicit conflict and fresh options if a slot is taken.
- Mint cryptographically secure expiring customer management tokens, store only hashes, and scope every read/mutation to the token's appointment/customer.
- Return explicit delivery confirmation for communications; never conflate queued and delivered states.
- Ingest website outbox records once using their UUID as idempotency key. Persist the Volteira ID only after confirmed transfer. Reconcile uncertain network outcomes before retrying. Avoid duplicating the operational record.
- Normalize auth, validation, conflict, rate-limit, timeout, and unavailable errors. Retry only idempotent operations with bounded backoff.
- Provide auditable estimate approval and hosted PCI-compliant invoice payment flows; never send card data through this site.

## Webhooks

Future events: appointment.created/updated/cancelled/rescheduled, customer.updated, service.updated, availability.updated, estimate.created/approved, invoice.created/paid, job.completed, business.settings.updated, ai.knowledge.updated.

`lib/volteira/webhooks.ts` contains a tested **proposed** timestamped HMAC verifier. Its format must be matched to the actual provider's documented signature protocol before use. The route currently returns 503 and does not acknowledge events.

A live handler must cap body size, verify the raw body and timestamp, atomically claim a unique event ID in the private receipt table, apply changes in a transaction, mark processed only after commit, and make retries safe. Add tests for duplicate events, replay, invalid signatures, processing failures, and out-of-order versions. Exactly-once arrival must never be assumed.

## Activation checklist

1. Obtain a documented API and business-scoped credentials.
2. Implement the adapter and outbox consumer; exercise real provider failure cases.
3. Implement the booking and appointment-management experiences against that adapter.
4. Validate scheduling rules and atomic concurrent booking in a provider-backed staging environment.
5. Connect authoritative settings, AI, and webhook consumer.
6. Remove the database scheduling-off constraint only in the release that delivers these features.
7. Let an authorized owner intentionally enable scheduling after configuring working days and hours.
