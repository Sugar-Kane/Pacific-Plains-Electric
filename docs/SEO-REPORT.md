# Pacific Plains Electric: local SEO and AI-search report

Scope: make Pacific Plains Electric unmistakable to Google, Bing, Apple, and AI search tools as **an electrical contractor serving San Luis Obispo County, California**. No invented facts: anything unknown is a `TODO(owner)` in code and is left off the site until confirmed.

## 1. Changes implemented

- **One business entity, everywhere.** `config/business.ts` holds the name, description, phone numbers, email, hours, license, service area, logo, and the profile and review links. The pages, footer, structured data, and `llms.txt` all read from it, so NAP details can't drift.
- **Structured-data graph.** Every page carries the `Electrician` entity (`https://www.pacificplainselectric.com/#business`) and a `WebSite` entity. Pages add `Service`, `BreadcrumbList`, `FAQPage`, `Article`, `AboutPage`, and `ContactPage` nodes that reference the business by `@id`.
- **Homepage:** H1 "Electrician serving San Luis Obispo County", a factual first paragraph, call / text / online-form actions, trust facts (license, $180 diagnostic, service area, hours), a services overview, a service-areas section, the scroll story, the owner, reviews (hidden until real ones exist), FAQ, and a call to action.
- **Services:** 13 service pages, each with an overview, common reasons, warning signs where relevant, what we do, a process, the service area, FAQs, related services, and Service + FAQ + Breadcrumb schema.
- **Service areas:** a hub plus 9 community pages with local content (who issues permits, coastal vs. inland conditions, housing considerations), the services most requested there, links to nearby communities, and local FAQs.
- **Guides:** 4 new guides and 3 updated ones, with Article schema and links to related services.
- **FAQ:** expanded from 7 to 12 questions; 9 are answered from confirmed policy and 3 are held as TODOs (not published).
- **About:** a plain factual summary of the business, owner, license, services, region, and approach.
- **Technical:** an `llms.txt` route, a web manifest, PNG logo and app icons, a 1200×630 social image, Twitter and Open Graph tags on every page, descriptions of 120–160 characters, unique titles under 65 characters, a 308 permanent redirect for `/schedule`, and Projects set to noindex while empty.
- **Reviews:** a reviews section that only renders real reviews from `config/reviews.ts`, an optional "Leave a Google review" button, and a compliant workflow (`docs/REVIEWS.md`).
- **Scroll story:** the 3D house is replaced by a real CC0 photo that lights up as you scroll. three.js is removed.

## 2. Files changed

New: `config/areas.ts`, `config/reviews.ts`, `app/service-areas/page.tsx`, `app/service-areas/[slug]/page.tsx`, `app/llms.txt/route.ts`, `app/manifest.ts`, `scripts/build-brand-assets.mjs`, `scripts/build-house-story.mjs`, `scripts/seo-audit.mjs`, `docs/REVIEWS.md`, `docs/SEO-REPORT.md`, `public/brand/{logo-512,icon-192,icon-512,apple-touch-icon}.png`, `public/images/og-default.jpg`, `public/images/story/*`, `assets/story/house-night.webp`.

Changed: `config/business.ts`, `config/content.ts`, `lib/seo/index.tsx`, `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/faq/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/projects/page.tsx`, `app/request-service/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/schedule/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/globals.css`, `components/public.tsx`, `components/header.tsx`, `components/footer.tsx`, `components/icons.tsx`, `components/request-form.tsx`, `components/powered-house.tsx`, `lib/security/validation.ts`, `lib/volteira/mock.ts`, `tests/browser/site.spec.ts`, `docs/HANDOFF.md`, `docs/ASSETS.md`.

## 3. New pages

- Service areas: `/service-areas`, plus `/service-areas/` `san-luis-obispo`, `nipomo`, `arroyo-grande`, `grover-beach`, `pismo-beach`, `avila-beach`, `morro-bay`, `atascadero`, `paso-robles`
- Services: `/services/residential-electrical`, `/services/outlet-switch-installation`, `/services/dedicated-circuits`, `/services/remodel-electrical`
- Guides: `/blog/why-does-my-breaker-keep-tripping`, `/blog/100-amp-vs-200-amp-service`, `/blog/can-my-panel-support-an-ev-charger`, `/blog/gfci-vs-afci-protection`
- `/llms.txt`, `/manifest.webmanifest`

New service pages send requests under an existing request category (`requestAs`), because the intake database only accepts the original nine. No database migration was needed.

## 4. Structured data

- `Electrician` with a permanent `@id`: name, description, URL, PNG logo, image, telephone, email, `areaServed` (the county plus each published community, each linked to Wikipedia), `contactPoint`, `hasCredential` (CSLB license number, recognized by the Contractors State License Board), `knowsAbout`, and `hasOfferCatalog` linking to each Service.
- No street address is published (it's a service-area business). Opening hours, `sameAs`, and `paymentAccepted` are added automatically once the TODOs are filled.
- **No review or rating markup.**
- Validated with validator.schema.org on every page type: **0 errors, 0 warnings.** `scripts/seo-audit.mjs` also checks that every JSON-LD block parses and every `@id` reference resolves.

## 5. Technical SEO

- `robots.txt` allows everything public and blocks `/admin`, `/api/`, `/auth/`, and `/appointment/`. Preview deployments block everything and send `noindex`.
- `sitemap.xml` lists 39 URLs, including services, areas, guides, and published CMS posts. It excludes Projects while empty, and never lists private routes.
- Every page has a canonical URL, a single H1, a unique title, and a description.
- `/schedule` is a 308 permanent redirect instead of a 307.
- Admin stays `noindex` with `Cache-Control: private, no-store`.
- The audit script (`node scripts/seo-audit.mjs <url>`) checks all of this against a running build.

## 6. Local SEO

- The service area is stated the same way everywhere; community pages say "we come to you", with no fake offices.
- Local, verifiable content: the incorporated cities have their own building departments; Nipomo and Avila Beach are unincorporated and permitted by the County; PG&E is the utility for most of the county; coastal salt-air corrosion; inland heat loads; rural outbuildings and wells.
- Links run both ways: service pages link to every community, community pages link to their relevant services and nearby communities, and the footer and header link the hub.

## 7. AI-search optimization

- Plain factual sentences on the pages that AI tools quote: "Pacific Plains Electric is a licensed electrical contractor providing residential and commercial electrical services throughout San Luis Obispo County, California."
- `llms.txt` gives a concise, generated summary with key facts, pages, services, areas, and FAQs.
- Question-and-answer content for the questions people ask assistants: Tesla Wall Connector, panel capacity, cost of a service call, and service area.

## 8. Performance

- three.js is removed; the scroll story is about 190KB of lazily loaded images.
- The fallback web font is no longer preloaded (most devices use the system font).
- Pages stay server-rendered and statically generated where possible. There are no third-party scripts.
- Still to measure: field Core Web Vitals in Search Console once the site has traffic.

## 9. Remaining TODOs (need the owner)

All of these are in `config/business.ts` unless noted:

1. **Days of the week** for the 7 AM–5 PM hours (`hours.days`).
2. **License classification** from the CSLB lookup (e.g. C-10).
3. **Insurance and bonding:** only if you want them published.
4. **Payment methods** accepted.
5. **Profile URLs** (`sameAs`): Google Business Profile, Yelp, Facebook, Nextdoor, BBB, Angi.
6. **Google review link** (`googleReviewUrl`).
7. **Typical lead time** for a visit (FAQ in `config/content.ts`).
8. **Confirm each community** in `config/areas.ts` is one you want work in (set `published: false` to drop one).
9. **Confirm the Tesla Wall Connector answer** reflects how you install them.
10. **Real project photos**, including a dusk photo of a finished job to replace the stock photo in the scroll story (see `docs/ASSETS.md`).
11. **Real reviews**, once you have them (`config/reviews.ts`).

## 10. Google Business Profile: do these yourself

- **Business name:** exactly "Pacific Plains Electric". No keywords added.
- **Primary category:** Electrician.
- **Secondary categories:** only ones that are accurate. "Electrical installation service" and "Lighting contractor" fit the services offered; add "EV charging station contractor" only if that category appears and matches what you do. Do **not** use Handyman, TV mounting, or General contractor.
- **Service area:** San Luis Obispo County, or the individual cities. Hide the street address (service-area business).
- **Phone:** (805) 626-7761. **Website:** https://www.pacificplainselectric.com.
- **Appointment link:** https://www.pacificplainselectric.com/request-service
- **Hours:** the real days, 7 AM–5 PM.
- **Services:** add each service from the site with a one-line description.
- **Description:** "Pacific Plains Electric is a licensed electrical contractor (CSLB #1162180) providing residential and commercial electrical services throughout San Luis Obispo County: troubleshooting and repair, panel upgrades, EV charger installation, lighting, dedicated circuits, and remodel wiring."
- **Photos:** logo (`public/brand/logo-512.png`), a cover photo, real job photos (panels, chargers, lighting), and the truck and you on the job. Add new ones regularly.
- **Reviews:** start the workflow in `docs/REVIEWS.md` and reply to every review.
- **Search Console and Bing Webmaster Tools:** verify the domain and submit `https://www.pacificplainselectric.com/sitemap.xml` in both. Bing can import directly from Search Console.

## 11. Directory and listing corrections

Use exactly: **Pacific Plains Electric · (805) 626-7761 · https://www.pacificplainselectric.com · nick@pacificplainselectric.com · serving San Luis Obispo County, CA · CSLB #1162180.** Primary category on every platform: **Electrician / Electrical contractor.**

| Platform | Action |
|---|---|
| Google Business Profile | Create or claim; set it up as above |
| Bing Places | Import from Google Business Profile, then check the category |
| Apple Business Connect | Claim; category Electrician; service area, not an address |
| Yelp | Claim; category Electricians. **Remove Handyman / TV Mounting if listed** |
| Angi | Check the categories. **Angi often defaults to Handyman: change it to Electrician** |
| Facebook | Page category Electrician; same name, phone, and website |
| Nextdoor | Business page, category Electrician |
| BBB | Only if you use it; same NAP |
| CSLB | Make sure the license record's business name and phone match |
| Chambers of commerce (SLO, Arroyo Grande, Paso Robles, etc.) | A listing gives a local backlink plus NAP consistency |

Flag and fix any profile that lists the business primarily as **handyman, TV mounting, or general repair**.

## 12. Next 10 highest-impact actions

1. Create, verify, and fully complete the **Google Business Profile** (section 10).
2. Verify **Search Console** and **Bing Webmaster Tools**, and submit the sitemap.
3. Start the **review workflow** after every job.
4. Fix any **Handyman / TV mounting** categorization on Angi, Yelp, Thumbtack, and similar sites.
5. Fill in the **business-hours days** and **profile URLs** in `config/business.ts`.
6. Take and add **real project photos** (and a dusk photo for the scroll story).
7. Claim **Apple Business Connect** and **Bing Places**.
8. Get **local backlinks**: chamber of commerce, supplier "find an installer" lists (EV charger and panel makers), and local builders and remodelers you work with.
9. Publish one useful **local guide a month** from real questions customers ask.
10. After 60–90 days, review Search Console queries and expand the pages that get impressions.

## Pacific Plains Electric AI visibility checklist

| Item | Status | Notes |
|---|---|---|
| Google Business Profile | Not Started | Not verified from here; no profile URL on record |
| Google reviews | Not Started | Workflow ready in `docs/REVIEWS.md` |
| Website indexing | Needs Work | Site is live and crawlable; confirm in Search Console |
| Business entity schema | Complete | Validated: 0 errors and 0 warnings |
| Service pages | Complete | 13 pages with substantive content |
| Location pages | Complete | 9 communities plus a hub; owner to confirm the list |
| Bing indexing | Needs Work | Submit the sitemap in Bing Webmaster Tools |
| Apple Business Connect | Not Started | |
| Yelp | Not Started | Not verified from here |
| Angi categorization | Needs Work | Check for Handyman categorization |
| Contractor directories | Not Started | |
| Sitemap | Complete | 39 URLs, generated from config |
| Robots.txt | Complete | |
| llms.txt | Complete | Generated from config |
| Search Console | Not Started | Not verified from here |
| Bing Webmaster Tools | Not Started | |
| Local backlinks | Not Started | |
| Customer reviews | Not Started | Section ready; it shows when reviews are added |
| Project photography | Not Started | The scroll story uses a labeled stock photo |
| NAP consistency | Needs Work | Consistent on the site; directories are unchecked |
| AI-search entity clarity | Complete (on site) | Off-site profiles will strengthen it |
