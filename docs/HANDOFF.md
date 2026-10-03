# Pacific Plains Electric — handoff

## What was built

The site uses warm ivory, forest green, gold, serif headings, and Central Coast imagery inspired by the supplied references. It includes Home, all nine service pages, About, Projects, Blog and three planning articles, FAQ, Contact, Request Service, privacy and terms. The schedule route directs customers to requests while scheduling is off. Appointment links fail safely with contact options until live appointment management exists.

The reference images' sample prices and contact details were replaced by the attached brief's business information: Nicholas Kane, CSLB #1162180, (805) 626-7761, direct (209) 626-9313, nick@pacificplainselectric.com, and a $180 diagnostic. The initial fee-credit setting is false. Insurance is not advertised. No reviews, years in business, completed work, addresses, or available appointments were fabricated.

The Supabase project is `xcknbrmmypjnkbuyxutm`, organization `ymdcpwdwvubghruyghnw`. The earlier Volteira project was inspected during discovery but never changed or used for the website connection.

## Architecture and ownership

Next.js App Router renders the public content on the server. Small client components provide navigation, theme preference, forms, the prepared-answer assistant, and admin editors. CSS variables define both themes; local Arimo fonts avoid runtime font requests. Optimized WebP assets use Next/Image.

- Website: brand, public content, SEO, preferences, access memberships, audit records, temporary request outbox.
- Volteira: eventual authoritative customer, service, availability, appointment, job, estimate, invoice, payment, communication, and AI data.
- Outbox records are temporary intake, not a second business-management system. Transfer is not implemented. Until then, admins must review and contact requesters manually.

A `VolteiraProvider` interface separates UI from operational integration. Production returns an unavailable result until an adapter based on verified APIs exists. The test-only `MockVolteiraProvider` is never selected by deployed routes. Its bookings are synthetic tests, not real availability.

## Database schema

SQL migrations are in `supabase/migrations`; filenames match the applied remote migration versions.

| Table | Purpose | Access |
|---|---|---|
| `website_settings` | Saved scheduling preferences and initial settings | Owners/admins; scheduling constrained OFF |
| `website_content` | Draft/published articles and project stories | Public sees only published; owners/admins edit |
| `website_request_outbox` | Customer request awaiting manual review/transfer | Owners/admins read/update; owner delete |
| `website_members` | Verified-email membership and roles | Owners/admins according to role hierarchy |
| `website_audit` | Actor, action, entity, timestamp | Owners/admins read; triggers append |
| `ppe_private.request_receipts` | Payload fingerprint, contact rate limit, idempotency | No direct client access |
| `ppe_private.webhook_events` | Reserved durable webhook receipt store | No direct client access; consumer not implemented |

Anonymous submissions call `submit_website_request`, which exposes only a validated write path. The privileged implementation is in a non-exposed schema. There are no anonymous request reads. The function checks contact fields, service, consent, payload size, idempotency, and three requests per email per hour. This is a basic contact-based spam limit; production-grade abuse prevention should add CAPTCHA and network-level rate limits. No upload endpoint is exposed.

## Owner/admin access

Initial owner memberships are configured for:

- adamkane13.ak@gmail.com
- nick@pacificplainselectric.com
- nicholas.kane92@gmail.com

No passwords or invitation emails were created. Each user opens `/admin`, selects **First time? Create your account**, enters the configured email and a password of at least 12 characters, verifies the email, and signs in.

Before account setup, configure Supabase **Authentication → URL Configuration**:

- Site URL: the active website origin.
- Redirect allowlist: `https://www.pacificplainselectric.com/auth/callback` and the Vercel review origin's `/auth/callback` when needed.
- Keep email confirmation enabled. Configure your own SMTP provider for reliable production auth email; otherwise Supabase's email restrictions apply.

The signup flow targets the canonical custom-domain callback. Until that domain is active, use the Supabase verification link and return manually to the Vercel site to sign in, or configure the callback origin for the review deployment before sending signup confirmations.

Roles are checked on the server and in database policies against verified `auth.users` email and current membership. User-editable metadata is never trusted. Membership changes take effect immediately for protected database actions; stale JWT role claims do not grant continued access.

| Role | Rights |
|---|---|
| OWNER | Requests, content, settings, add/change/remove admins and owners |
| ADMIN | Requests, content, settings, add/change/remove admins and technicians; cannot grant ownership or modify owners |
| TECHNICIAN | Reserved for future operations; no website admin access |

`/admin/team` manages access. Adding access does not send an email; the new person registers and verifies their address. Self-role changes are blocked, and at least one owner must remain. Do not use the Supabase management login as the website password: app accounts are separate.

Supabase Auth handles password hashing and authentication rate limits. The app refreshes sessions through `proxy.ts` and uses HTTPOnly, Secure production, SameSite=Lax cookies. MFA enrollment UI, password reset UI, and a session-control console remain future work; Supabase's auth platform can support these. Password resets can be managed in the Supabase dashboard meanwhile.

## Admin routes

- `/admin/dashboard`: real request counts from the latest 100 records and explicit integration statuses.
- `/admin/service-requests`: read inquiries and mark reviewed. No automated contact is sent.
- `/admin/website`, `/admin/blog`, `/admin/projects`: plain-text content create/update by slug; drafts private; SEO title/description required for publishing.
- `/admin/team`: RBAC management.
- `/admin/settings/scheduling`: working days, hours, duration, buffer, minimum notice, horizon, same-day preference.
- `/admin/settings/business`: verified configuration display; dynamic business edits require the authoritative provider.
- `/admin/settings/integrations`, `/admin/ai`: honest connection status and approved initial knowledge.
- Other operational admin routes explain that they require Volteira rather than showing invented business data.

Content editor limitations: editing is by re-entering an existing slug; loading entries into a full editor, media management, rich text, review approval, and automated SEO diagnostics are not implemented. Starter service copy, FAQs, and planning articles are in `config/content.ts`; the CMS currently publishes additional articles and project stories.

## Scheduling and business hours

Scheduling is OFF at every layer. Nicholas can save days and hours through **Admin → Scheduling**, with no days preselected. The initial suggestion is 7 AM–5 PM. Saving hours never enables bookings.

The enable control returns an explanation while live integration is absent. A database constraint also blocks enabling. To activate in a future release: implement and test the actual Volteira provider, source availability and booking rules from it, remove the guard through a reviewed migration, connect the booking UI and settings state, then let an owner intentionally enable scheduling.

The enabled booking UI, per-service durations, technician assignment, holidays/vacations, blocked-time editor, service-area validation, atomic production slot reservations, secure appointment tokens, reschedule/cancel, and calendar exports remain integration work. None are represented as live today.

Time handling uses `America/Los_Angeles`. Audit/request timestamps are stored in UTC with timezone-aware formatting. No fixed PST/PDT offsets are used. Public hours are 7 AM–5 PM Pacific without invented working days.

## AI and notifications

The floating helper answers only fixed approved topics and openly states that live website AI is not connected. It provides request, main phone, and Nicholas's direct line. No free-form pseudo-AI response generator exists. Real shared AI knowledge and conversation history must come from Volteira.

The service form stops on several obvious emergency phrases and directs people to emergency services rather than providing DIY guidance. The website does not advertise 24/7 electrician dispatch.

No notification provider is configured. The UI never says an email/SMS was sent. Transactional contact consent is required; optional SMS consent is separate, not preselected, and records disclosure text. No marketing enrollment or payment collection is included.

## Environment variables

See `.env.example`. Supabase URL and publishable key are safe client credentials and are configured in Vercel. No privileged Supabase key is required for the implemented intake or admin paths. No secrets are committed.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Separate website project's URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public project key; RLS provides data protection |
| `NEXT_PUBLIC_SITE_URL` | Reserved site-origin setting; canonical business origin currently lives in centralized config |
| `VOLTEIRA_MODE` | Recorded intent; deployed provider stays unavailable until implemented |
| `VOLTEIRA_API_URL`, `VOLTEIRA_API_KEY` | Reserved server-only future credentials; unused today |
| `VOLTEIRA_WEBHOOK_SECRET` | Reserved future signature secret; unused by inactive route |
| `SUPABASE_SECRET_KEY` | Reserved privileged integrations; not required or configured today |
| `VOLTEIRA_ADAPTER_READY` | Reserved future setting; cannot override the code/database fail-closed guards |

## Security and privacy

Input validation is server-side with Zod and repeated at the database boundary. RLS is enabled for every table. All admin actions reauthenticate and authorize; database rules independently enforce access. Request origins are checked. Server Actions provide their framework origin protection. Text content is rendered without raw HTML. JSON-LD escapes `<`. Security headers include CSP, HSTS, frame denial, nosniff, referrer and permissions policies. CSP allows inline framework/bootstrap scripts; a nonce-based CSP is a future hardening improvement.

There are no upload or card-handling endpoints. No general analytics transport is enabled. The analytics interface only allows named events, not arbitrary PII properties. Retention automation, full attribution capture, and monitoring integrations remain unconfigured. The privacy/terms pages describe the implemented behavior; final business/legal approval remains needed before public launch.

## SEO

Public pages are server rendered, with titles, descriptions, canonical URLs, Electrician/Service/Article/Breadcrumb JSON-LD, visible service breadcrumbs, sitemap, and robots. Published CMS content joins the dynamic sitemap. Drafts and private admin/appointment/auth routes are excluded. Preview deployments send noindex headers. No fake ratings, storefront addresses, or opening days are emitted.

The service-area content describes San Luis Obispo County without manufacturing location landing pages. Dedicated service-area pages, automated internal-link suggestions, Search Console/Google Business Profile verification, and Core Web Vitals field measurements are future work.

## Domain and deployment

Repository: `Sugar-Kane/Pacific-Plains-Electric`. Vercel project: `pacific-plains-electric`, team `adams-projects-8fc7ddbf`.

The user purchased the correctly spelled `pacificplainselectric.com` on October 3, 2026. Public DNS confirms Namecheap parking records. Both the apex and www domain are attached to the Vercel project. Namecheap DNS editing still requires an authenticated browser session; the connector only supports availability checks.

`www.pacificplainselectric.com` has been added to Vercel. The latest Vercel verification recommends a CNAME record for host `www` pointing to `1c45b30ae4b08ff7.vercel-dns-017.com`. Verify the current record through the Vercel domain panel before applying. Do not change nameservers or existing MX/email records unnecessarily. For the apex, Vercel recommends two A records at @: 216.198.79.1 and 64.29.17.1. Replace Namecheap parking/URL redirect records for @ and www, preserving email records.

Deployment uses Next.js on Vercel in `sfo1`, `npm ci`, and `npm run build`. Keep preview protection enabled. Promote a tested deployment only after the domain, auth callback, and owner access are ready.

## Status matrix

| Status | Capability |
|---|---|
| WORKING | Public routes, nine service pages, FAQ, contact, starter articles, themes, responsive layout, mobile call/request bar |
| WORKING | Validated request intake, idempotency, contact rate limit, protected outbox and manual review |
| WORKING | Server authorization, database RBAC, three owner memberships, admin management of other admins |
| WORKING | CMS drafts/publishing, scheduling preference storage, audit logging, SEO metadata and crawl controls |
| MOCKED | Isolated provider used only by unit tests; never used for customer requests |
| REQUIRES VOLTEIRA | Live bookings, availability, appointment management, operations, shared AI, request transfer, webhook consumer |
| REQUIRES CREDENTIALS / CONFIGURATION | Auth email delivery and callback URLs, notification providers, any future payment/analytics integrations |
| REQUIRES BUSINESS DECISION | Final legal approval, real working days, fee-credit policy changes, retention policy |
| REQUIRES REAL CONTENT | Completed projects/photos, verified reviews, Nicholas's detailed biography, approved insurance claims |
| NOT YET IMPLEMENTED | Photo uploads, full CMS editing workflow, customer self-service, enabled scheduling UI, MFA/password-reset UI, monitoring, attribution, calendar exports |

See `VERIFICATION.md` for what was actually exercised. A passed local test is not a claim that unconnected integrations work.
