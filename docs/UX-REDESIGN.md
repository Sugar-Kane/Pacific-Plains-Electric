# Pacific Plains Electric homeowner redesign

Implemented October 11–12, 2026 (America/Chicago), on local branch `codex/homeowner-ux`. No deployment, push, production database change, live customer request, email, SMS, or phone call was made.

## Changes and before/after

| Area | Before | Implemented |
| --- | --- | --- |
| Homepage | Long geographic headline; house animation before services; three equally weighted actions | Compact customer headline, emphasized Request Service and Call, six plain-language service cards, three steps, clear diagnostic example, owner/license verification, coverage and four essential FAQs |
| Navigation | Six top-level links | Services, About, Service Area; Guides/FAQ retained in footer; Home/Contact added to mobile menu; two-action sticky bar |
| Inquiry | First/last name, phone, email, address, city, ZIP, description required; mandatory review screen | Name, phone, city OR ZIP required; service choice and existing consent retained; description/email/time optional; one submit step; no account |
| Pricing | Diagnostic not automatically credited | Shared $180 credit policy for qualifying approved repairs related to the original visit; $500 quote less $180 paid = $320 remaining, $500 total |
| Coverage | SLO County plus Santa Barbara city; no checker | Entire SLO and Santa Barbara counties authorized by user; 78 distinct ZIPs, including postal and boundary ZIPs, with qualified boundary messages |
| Failure handling | Review screen and generic failure | Focused announced error, preserved values, phone fallback, timeout, exact-payload retry with same key after uncertain outcomes; malformed success rejected |
| Backend | All detailed inquiry fields mandatory | Backward-compatible payload keys; optional initial details accepted; no placeholder addresses or fabricated emails; same protected outbox and owner workflow |
| Education/SEO | Interactive house on homepage | House preserved in `/blog`; existing service/location/article URLs, canonical tags, metadata, sitemap, robots, and security headers retained |

Changed areas: `app/page.tsx`, shared header/footer/public components and CSS; request form/page/server validation/API; services/contact/service-area/terms/privacy pages; shared business/content/coverage configuration; admin request display and pricing information; notification formatting; structured business coverage. FAQ and related service/area answers inherit the shared policy. The owner email now handles missing email/address without a broken reply-to field.

## Diagnostic policy verification

The shared policy states: “The $180 diagnostic fee is credited toward qualifying approved follow-up repairs related to the original diagnostic visit. Repairs are quoted before you approve the work.” It appears on homepage, service overview, troubleshooting, request form and acknowledgment, FAQ, terms/about, service-area FAQ, owner notification, llms.txt, and relevant admin settings. Existing contradictory customer copy was removed. Historical migration files remain unchanged; the new migration supersedes their default and updates the stored settings mirror with an explicit system audit event. Its normal audit trigger is enabled after the atomic update.

No active invoice/payment engine exists here. Volteira estimate/invoice interfaces are unimplemented contracts. No financial calculations or payment transactions were invented. Before connecting billing, record the $180 paid once and apply it once to qualifying work; test duplicate credits, duplicate charges and nonnegative balances. Refund/transfer handling when repair totals are below $180 remains an owner decision. No expiration or new restriction was added.

## Executed verification

- Production build, TypeScript and ESLint passed.
- 9 unit/database tests passed against a fresh disposable local PostgreSQL database with all repository migrations. They cover short and legacy payloads, malformed input, consent, hazards, ZIP lists, webhook checks, scheduling mock safety, idempotency, contact throttling, anonymous access denial, owner visibility and RLS.
- 20 browser tests passed: all public routes and discovered internal links, canonical URLs and images; existing detail-service links preselect correctly; main customer paths, retry and malformed-success behavior, mobile actions, ZIP feedback, light/dark theme and menu behavior, privacy routes and headers.
- Responsive overflow checks passed at 320, 375, 390, 430, 768, 1024 and 1440 CSS pixels on homepage, services, request, contact and admin entry. 320px reflow also covers the narrow effective layout at high browser zoom. Manual mobile and desktop review performed; not a full assistive-technology certification.
- Axe scans found no violations in tested WCAG 2/2.1/2.2 A/AA rules on homepage, form and admin entry in both themes. Keyboard menu Escape returns focus to the toggle; request success/error focuses the result.
- Real local browser → Next.js API → local RPC transport → migrated PostgreSQL submissions completed for Electrical Problems & Repairs and EV Charger Installation. Both rows were checked in the outbox as `received`. The transport fixture substitutes for hosted PostgREST; no hosted Supabase or real owner login was exercised.
- Runtime dependency audit: 0 findings. The existing development lint toolchain has 5 high-severity transitive audit findings; npm proposes an incompatible Next lint downgrade. These pre-existing development dependencies were not force-upgraded or downgraded.

| Requested journey | Result |
| --- | --- |
| A: broken outlet | Passed local form/API/database save; owner row visibility tested at database policy level |
| B: EV charger | Passed preselection and real local save |
| C: diagnostic pricing | Passed consistent policy, example and diagnostic link checks |
| D: mobile | Passed narrow layouts, sticky actions, input and successful local acknowledgment |
| E: outside primary area | Passed both counties, boundary ZIP and unknown ZIP messaging; unknown ZIP never blocks inquiry |
| F: unsuccessful submission | Passed retained input, call fallback, identical-key retry and malformed-success rejection |
| G: diagnostic credit | Public wording/example passed; invoice calculations not applicable until billing integration exists |

## Measured performance

Lighthouse local production-build runs, simulated mobile and desktop defaults:

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance score | 94 | 100 |
| Largest Contentful Paint | 2.3 s | 0.5 s |
| First Contentful Paint | 1.5 s | 0.2 s |
| Cumulative Layout Shift | 0 | 0 |
| Total Blocking Time | 220 ms | 0 ms |

These are individual lab runs, not real-user 75th-percentile measurements. INP was not measured; TBT is not INP. No measured before/after speed improvement is claimed. The animation no longer hydrates on the homepage and no runtime library was added. Actual post-launch LCP/INP/CLS require field monitoring.

## Preserved integrations and limits

Next.js 16 App Router architecture, Supabase public/owner clients, authorization, protected outbox, CMS, audit trail, notifications, webhook verification, CSP, theme and SEO routes remain. Scheduling remains intentionally disabled by both configuration and database constraint. No live website chatbot exists; admin wording now accurately says so. The separate automated phone assistant was not modified. Uploads remain unavailable because secure storage and retention are not configured. Analytics transport remains disabled as before.

The existing `sms:` action and contact number are retained from the live site and repository. Actual call/SMS routing and owner email delivery were not exercised. Genuine owner/project photos and verified reviews were absent; no substitutes or fabricated claims were added. The text-led owner section is ready for supplied photography.

## Deployment dependency — approval required

The new migration MUST accompany the application release. Applying only the frontend against the old database would reject shorter requests and the new “other” category. After explicit production approval:

1. Apply `supabase/migrations/20261012033541_homeowner_intake_and_diagnostic_credit.sql` through the normal reviewed migration process. It retains old payload compatibility, RPC names, outbox, permissions and audit behavior.
2. Deploy this application revision. Keep scheduling disabled.
3. Run a separately authorized synthetic hosted intake/owner-notification check, then verify the protected admin inbox, email delivery, phone/SMS routing and mirrored fee setting. Do not claim these hosted checks passed based on local tests.
4. Update the separately managed phone assistant’s pricing policy before relying on it to explain the new credit.

Rollback: roll back the app first if needed; the new database accepts old full-detail requests. Do not remove the new schema column/index while newer code is active. Local development fixture code is test-only and must never be used as a hosted service.

## Owner information still needed

- Genuine owner and project photographs; permission to display real reviews if supplied.
- Confirmation that SMS still works on the existing business number.
- Policy for approved repair totals below $180; no refund or transfer claim has been published.
- Operational readiness and working days before enabling actual online scheduling.
- Separate phone-assistant access/coordination for matching policy updates.

County-wide coverage was explicitly confirmed by the user. ZIP data provenance and all selected codes are in `docs/ZIP-COVERAGE.md`; ZIP lists are approximate geography and do not replace work-address confirmation.

## Quality assessment

Clarity, navigation, service selection, form simplicity and pricing now meet the requested customer flow. Trust uses the existing owner/license facts plus an official verification link, with photography still outstanding. Tested mobile layouts and automated accessibility checks pass. Lab performance meets the LCP/CLS targets, while field INP and 75th-percentile results remain unmeasured. Local integration behavior is verified; hosted delivery and authenticated UI verification remain release checks.

## Reproducing the local database checks

Use a fresh disposable PostgreSQL cluster bound to `127.0.0.1:55439`, never a production URL. Apply `tests/fixtures/local-auth.sql`, then every file in `supabase/migrations/` in filename order with `ON_ERROR_STOP=1`. Run `PPE_TEST_DATABASE_URL=postgresql://postgres@127.0.0.1:55439/postgres npm test`. The opt-in database test refuses non-local hosts. Without this variable, it is intentionally skipped.

For a manual form-to-database smoke test, run `python3 tests/fixtures/local-rpc.py` on loopback port 55440 and start the built app on port 3001 with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55440` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=local-test-only`. Leave mail credentials unset. This fixture only models the public RPC transport; it does not model Supabase Auth. Inspect the synthetic outbox rows with local SQL. Shut the fixture and database down when finished.
