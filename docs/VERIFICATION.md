# Verification — October 3, 2026

## Passed locally

- `npm run build`: production Next.js build, all public/admin/API routes.
- `npm run typecheck`: no TypeScript errors.
- `npm run lint`: no lint errors.
- `npm run test`: 6 tests passed (diagnostic and scheduling defaults, validation, hazard escalation, webhook verifier tamper/replay rejection, test-only booking idempotency/conflict, Pacific DST).
- `npm run test:e2e`: 14 tests passed.
- Responsive widths: 375, 390, 430, 768, 1024, 1440 px; home, services, request, contact, admin fit the viewport.
- Automated axe WCAG A/AA checks on home, request, and sign-in in light and dark: no violations. This is automated coverage, not a certification of complete WCAG conformance.
- Theme persistence; mobile navigation and Escape/focus behavior; all nine service links preselect the correct request service; phone and email links.
- All public routes: expected status, one H1, canonical, no browser exceptions, and internal links resolve.
- Service form: review screen, consent payload, success and failure states, same-origin validation.
- Admin pages show sign-in to unauthenticated users; private-route noindex and security headers present.

Browser success/failure form tests intercept the submission response so they do not create synthetic customer leads. The real database intake function was tested separately in a rolled-back transaction, including successful creation, retry idempotency, mismatched-payload rejection, rate limiting, and denial of anonymous request reads.

RBAC was tested in a rolled-back transaction with temporary auth identities. Confirmed: verified owners have owner rights; admins can add admins; admins cannot add owners or modify owners; unverified emails have no role and cannot list memberships. Temporary auth rows and test records were rolled back. No test emails or SMS were sent.

Supabase security advisors returned **no findings** after hardening. The generated RLS auto-enable function's client execution grants were removed. Private tables have explicit deny policies.

## Limits of verification

- No real user has yet completed the email verification/sign-in flow. Auth callback URLs and production mail configuration must be checked in the new Supabase project's dashboard.
- Owner/admin browser workflows require a real verified account; their server boundaries and database permissions were checked, but a real owner-session UI test was not performed.
- Production Volteira, live scheduling, AI, notifications, uploads, payment processing and appointment management are not connected and were not live-tested.
- No Core Web Vitals field data exists. Responsive and accessibility tests do not establish real-world LCP/INP/CLS scores.
- Both correctly spelled domains are verified with Vercel and have an issued SSL certificate. www returned HTTPS 200 and its health check passed after DNS was corrected.

## Dependencies

`npm audit --omit=dev` reported zero production vulnerabilities. The full dependency audit reports a development-only `braces` advisory inherited through Next.js's ESLint tooling. The registry currently reports braces 3.0.3 as latest; npm proposes an unrelated major downgrade of eslint-config-next rather than a compatible patch. No forced downgrade was applied. This affects developer lint tooling, not deployed application dependencies. Recheck when a compatible update is released.

## Deployed preview verification

Vercel deployment `dpl_3KikmdynLAsMAG5vBB2U5dGFxWzp` reached READY. Authenticated deployment checks returned HTTP 200 for `/request-service`; `/api/health` returned `status: ok`, `schedulingEnabled: false`, and `volteira: not_connected`. Deployment protection remains enabled.

The Supabase dashboard's ChatGPT sign-in was attempted with the requested adamkane13.ak@gmail.com account. OpenAI's account chooser returned a route error (400, invalid content type), so dashboard auth URL configuration remains unverified. The connected Supabase API and deployed database are working; this browser-login failure is separate from the website health check.

## Customer experience refresh

Removed the scripted chat widget, duplicate home-page links, repetitive slogans, and empty project navigation. Added self-hosted Barlow Condensed display typography. Preserved all nine services, accessible theme controls, contact methods, request intake, RBAC, and the existing (still unconfigured) Volteira provider. The latest run passed 14 browser tests and 6 unit/security tests.
