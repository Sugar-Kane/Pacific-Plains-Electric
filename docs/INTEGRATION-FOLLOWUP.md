# Integration follow-up — October 12, 2026

## Fixes completed locally

- Added bounded Resend retries for network errors, HTTP 429 and HTTP 5xx. Every retry reuses the exact payload and idempotency key. Permanent HTTP failures are not retried; provider retry windows are respected. Acceptance requires a response ID. Logs contain only request reference and status, never customer contact data or credentials.
- Kept notifications independent of the saved service inquiry; the protected admin inbox remains the source of truth. This is best-effort delivery, not a persistent mail queue or verified delivery receipt.
- Reject invalid database request references with a retryable response instead of telling the customer that an unconfirmed save succeeded.
- Added five notification tests using simulated transport; no emails were sent.

## Connected-account inspection

GitHub origin/main remains at 27ecebd. The redesign and these fixes remain local; pushing a connected branch can trigger Vercel automatically, so no branch was pushed or PR opened under the existing no-deployment instruction.

Vercel project pacific-plains-electric is connected and its latest inspected production deployment is READY. Environment metadata has REQUEST_EMAIL_FROM and REQUEST_EMAIL_TO for production and preview, but no RESEND_API_KEY. The sender domain is resend.dev. No secret values were exported or committed.

Resend has three verified domains, including volteira.com, but not pacificplainselectric.com. Attempting to add the business domain failed because the account has reached its plan's domain limit. No domain or DNS changes occurred. Owner must choose an upgraded plan/business domain or authorize an existing verified sender. Then configure a sending-only Resend API key directly in Vercel's server-only RESEND_API_KEY environment variable; do not paste credentials in chat. Existing unrelated domains were preserved.

Supabase project xcknbrmmypjnkbuyxutm is healthy. The live intake function still requires the older long-form fields, and the new local migration is absent. The migration is necessary before this app version goes live. No live database writes or synthetic customer rows were made.

Supabase security advisors report one warning: leaked-password protection is disabled. Enable through the project's Auth settings after reviewing plan availability. See https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . No RLS warning was returned.

The development dependency audit still reports five transitive high findings through braces 3.0.3; the registry's latest braces is 3.0.3. npm's suggested lint-config downgrade is incompatible with this app's Next version. No unsafe forced downgrade was made. Runtime dependencies had zero findings in the preceding audit.

## Release sequence requiring explicit approval

1. Resolve Resend sender choice and configure its sending-only key securely in Vercel.
2. Apply reviewed Supabase migration 20261012033541_homeowner_intake_and_diagnostic_credit.sql.
3. Publish reviewed code through the connected GitHub/Vercel pipeline.
4. With explicit permission for a synthetic notification, verify a hosted request, protected admin visibility and owner email delivery. Local tests do not establish live delivery.

SMS routing, genuine photographs, external phone-assistant wording and the policy for repairs costing less than $180 still require owner confirmation/access. No refund policy was invented.

## Verification this turn

13 unit tests passed, including five new email tests; the optional local database test was skipped this turn (its earlier nine-test run remains documented in UX-REDESIGN.md). All 20 browser tests passed against the rebuilt application. Production build, TypeScript and ESLint checks passed. No hosted submission, delivery test, production migration, push or deployment occurred.
