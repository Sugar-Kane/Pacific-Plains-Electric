# Pacific Plains Electric: UI/UX, bilingual parity and accessibility audit

Date: 2026-11-10 · Branch: `claude/ui-ux-accessibility-audit` (from `main` at `c5f12d2`) · Not deployed.

## A. Executive summary

The site was already in good technical shape. Before any change, an automated pass over 11 routes × 2 languages × 10 viewports (220 page loads) found:
- no horizontal overflow;
- no controls pushed off-screen;
- no axe WCAG 2.2 A/AA violations;
- one `<h1>` per page and the correct `lang` everywhere;
- no console errors.

The previous redesign (`docs/UX-REDESIGN.md`) had done most of the responsive and accessibility work.

The real problem was **English/Spanish parity**. The Spanish site was a separate, hand-written implementation and had drifted:
- **FAQ:** 5 questions instead of 9.
- **Home page:**
  - No service-area links, reviews slot or closing contact section.
  - The ZIP-code check existed only in Spanish.
- **Contact page:** a few plain links instead of the full contact layout and map.
- **Service pages (13):** two sentences and a link to the English guide.
- **Area pages (10):** a generic page instead of the local content.

Every Spanish page is now built from the **same components, in the same order**, as its English page, with a full Spanish content file. Automated tests now fail if the two languages drift again. Smaller fixes: WCAG 2.2 target sizes, service-area wording that sometimes named only San Luis Obispo County, and one duplicated pricing FAQ on the home page.

The green (`#1f4d3c`) and beige (`#f6f1e7`) palette, the logo, the fonts, the photography and all business rules are unchanged.

## B. Verified problems

| # | Page | Viewport | Issue | Severity | Reproduce / evidence | Status |
|---|---|---|---|---|---|---|
| 1 | `/es/faq`, `/es` | all | 5 Spanish FAQs vs 9 published English FAQs; different questions | High (parity) | Compare `/faq` and `/es/faq`; old `components/spanish-public.tsx` hard-coded 5 | Fixed |
| 2 | `/es/services/*` (13) | all | Spanish service pages were a 2-sentence stub linking to the English guide; no reasons, warning signs, scope, FAQs, related services | High (parity) | Open `/es/services/panel-upgrades` on `main` | Fixed |
| 3 | `/es/service-areas/*` (10) | all | No local considerations, permit information, common requests, area FAQs or nearby links | High (parity) | Open `/es/service-areas/nipomo` on `main` | Fixed |
| 4 | `/es/contact` | all | Plain links only; no contact cards, hours, text option or map | Medium (parity) | Compare with `/contact` | Fixed |
| 5 | `/` vs `/es` | all | ZIP lookup only on Spanish home; service-area links, reviews slot and closing call-to-action only on English | Medium (parity) | Compare the two home pages | Fixed: both have all of them |
| 6 | `/services`, `/services/*`, `/about` | all | Service area described as "San Luis Obispo County" or "San Luis Obispo County and in Santa Barbara", while the FAQ, home and coverage tool say both counties | Medium (consistency) | `/services` hero; service page "Where we offer" paragraph; About facts | Fixed: "San Luis Obispo and Santa Barbara counties" |
| 7 | `/services/*` breadcrumbs | 375×667 | Breadcrumb links 39×22 and 57×17 px | Low (WCAG 2.5.8) | `before/results.json`, `small` field | Fixed: 24px minimum |
| 8 | `/request-service` (both) | 375×667 | Consent checkboxes 20×20 px | Low (WCAG 2.5.8) | Same | Fixed: 24×24 |
| 9 | `/` | all | The $180 explanation appeared three times: hero line, diagnostic section, and the "How much does a service call cost?" FAQ directly below | Low (simplicity) | Home page | Fixed: home FAQ shows the EV charger question instead (both languages); the full FAQ keeps the cost question |

Checked and **not** confirmed:
- **"Website" form field:** it's a spam honeypot. It's positioned off-screen, `aria-hidden`, `tabIndex={-1}` and `autoComplete="off"`, and the server rejects any value (`lib/security/validation.ts`: `website: z.string().max(0)`). It was not visible and is unchanged.
- **Mobile layout:** no overflow, clipping or overlapping controls at any tested viewport, before or after.
- **Animations:**
  - The service cards use realistic photographs, and the EV scene is physically plausible (car parked nose-out, cable to the rear charge port).
  - There is a visible "Pause animations" control, and `prefers-reduced-motion` is respected (covered by `service-animations.spec.ts`).
  - No art was changed.
- **Form:** labels, required markers, error focus/announcement, retry and confirmation were already accessible (covered by the existing `site.spec.ts` and `spanish.spec.ts`).

## C. Completed improvements

1. **One component architecture for both languages.**
   - `components/public.tsx`: every shared section (actions, service cards, hero/breadcrumbs, catalogue, pricing, owner, facts, FAQ, contact band, steps, area links, reviews) takes `lang`.
   - English output is identical to before, apart from the wording fixes in items 6 and 9.
2. **Spanish pages rebuilt** (`components/spanish-public.tsx`): home, services, 13 service pages, about, contact, service areas, 10 area pages, FAQ and request service. Each has the same sections in the same order as its English page.
3. **Spanish content** (`config/content-es.ts`):
   - All 13 services, with overview, reasons, warning signs, what we do and FAQs.
   - All 10 areas, with intro and 3 local considerations each.
   - The 9 published FAQs and the 3 steps.
   - Spanish meta descriptions for service and area pages.
   - Prices, license number, phone, PG&E / Southern California Edison, Title 24, GFCI/AFCI and all place names are identical to English.
4. **Service-area wording** made consistent in both languages.
5. **Target sizes:** breadcrumbs and checkboxes now meet the 24px minimum.
6. **Home page:** ZIP check added to the English home; the duplicated pricing FAQ swapped out.
7. **Tests:**
   - `tests/i18n-parity.test.ts` (6 checks): same services, list lengths, FAQ count, steps, areas and considerations; same price, license and phone in Spanish.
   - `tests/browser/spanish.spec.ts`: a new test that all 30 Spanish pages have the same number of `h2`/`h3`, FAQs, list items, forms and fields as English.
8. **Audit tooling:** `scripts/ui-audit.mjs` (the 220-check audit that produced the evidence in this folder).

## D. Responsive test matrix (Chromium)

11 routes × 2 languages per viewport. "Pass" means: HTTP 200; no horizontal overflow; no interactive element outside the viewport; exactly one `h1`; correct `lang`; no console errors. Results are in `before/results.json` and `after/results.json`.

| Viewport | Before | After |
|---|---|---|
| 320 × 568 | Pass (22/22) | Pass (22/22) |
| 375 × 667 | Pass (22/22) | Pass (22/22) |
| 390 × 844 | Pass (22/22) | Pass (22/22) |
| 430 × 932 | Pass (22/22) | Pass (22/22) |
| 768 × 1024 | Pass (22/22) | Pass (22/22) |
| 1024 × 768 | Pass (22/22) | Pass (22/22) |
| 1280 × 800 | Pass (22/22) | Pass (22/22) |
| 1366 × 768 | Pass (22/22) | Pass (22/22) |
| 1920 × 1080 | Pass (22/22) | Pass (22/22) |
| 2560 × 1440 | Pass (22/22) | Pass (22/22) |

- **200% zoom:** simulated as a 640px CSS viewport. Home, request, a service page and contact, in both languages: no overflow, no clipped text.
- **WCAG 1.4.12 text spacing override:** same pages at 640px and 375px. Pass.
- **Firefox and WebKit:** not run. Only Chromium is installed in this environment, and browser downloads are blocked.

## E. English/Spanish parity

| Area | Before | After |
|---|---|---|
| Navigation, header, footer, mobile bar | Shared already | Unchanged (shared) |
| Home sections | 6 in Spanish vs 8 in English; ZIP check Spanish-only | Identical set and order in both |
| FAQ | 5 vs 9 | 9 and 9, same order |
| Service pages (13) | Stub + link to English | Full, same sections |
| Area pages (10) | Generic | Full, same sections and FAQs |
| Contact | Plain links | Same layout and map |
| About | Owner and actions only | Same sections: owner, facts, what we do, where we work, how we work, how to reach us |
| Request form | Shared already | Unchanged (shared, same fields and validation) |
| Pricing, policies, license, phone | Same | Same (enforced by test) |

- **Remaining by design:** blog articles are English-only. The Spanish footer and FAQ label them "(en inglés)", with `hrefLang="en"`.
- **Language switching:** staying on the equivalent route and keeping the `?service=` selection when switching is covered by the existing test "Spanish browser preference and explicit language choice", which passes.
- **English left on Spanish pages:** a scan of 14 Spanish pages found no English text outside elements marked `lang="en"`.

## F. Accessibility

| Check | Before | After |
|---|---|---|
| axe WCAG 2.0/2.1/2.2 A+AA, 22 route/language pairs at 375×667 and 1280×800 | 0 violations | 0 violations |
| Existing axe tests (light and dark, English and Spanish) | Pass | Pass |
| Targets under 24px at 375px (excluding links inside sentences) | 7 (breadcrumbs, checkboxes, two email links) | 0 |
| Lighthouse accessibility, home page, both languages | 100 | 100 |

- **Covered by existing tests that still pass:** keyboard navigation, the skip link, focus on form errors and results, Escape closing the menu, reduced motion and reflow (`site.spec.ts`, `spanish.spec.ts`).
- **Remaining small targets:** the Privacy Notice and Website Terms links inside the consent sentences. They are under the 24px height, but the WCAG 2.5.8 inline-text exception covers them, and axe reports nothing.
- **Limitations:**
  - No screen-reader session (NVDA, VoiceOver) was run.
  - Text over the beach photo can't be contrast-checked automatically.
  - Automated results do not establish ADA legal compliance.

## G. Performance (Lighthouse 12.8.2, mobile, local production build, single runs)

| Run | Perf | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|
| Before `/` | 91 | 3.3 s | 140 ms | 0 | 641 KiB |
| After `/` | 95 (89 on an earlier run) | 2.8 s (3.2 s) | 70 ms (220 ms) | 0 | 643 KiB |
| Before `/es` | 92 | 3.3 s | 70 ms | 0 | 649 KiB |
| After `/es` | 92 | 3.2 s | 130 ms | 0 | 652 KiB |

- **Reading:** no measurable regression. The differences are within run-to-run variance; the same build scored 89 and 95. Page weight grew 2–3 KiB from the ZIP check and the extra Spanish sections.
- **Not measured:** INP, which needs real interaction or field data.
- **Raw numbers:** `lighthouse/summary.json`.

## H. Screenshots

Full-page JPEGs for home, services, request, contact, FAQ and service areas, at 375×667, 768×1024 and 1280×800, in both languages:
- before: `before/screenshots/` (36 files);
- after: `after/screenshots/` (36 files).

Pairs that show the parity change most clearly:
- `before/screenshots/es-contact-1280x800.jpg` and `after/screenshots/es-contact-1280x800.jpg`;
- `before/screenshots/es-home-375x667.jpg` and `after/screenshots/es-home-375x667.jpg`.

## I. Files modified

| File | Why |
|---|---|
| `components/public.tsx` | Shared sections take `lang`; English text unchanged except service-area wording in Facts |
| `components/spanish-public.tsx` | Spanish pages rebuilt from the shared sections, mirroring English |
| `config/content-es.ts` (new) | Spanish services, areas, FAQs and steps |
| `app/es/[[...path]]/page.tsx` | Spanish meta descriptions for service and area pages |
| `app/page.tsx` | ZIP check on the English home; home FAQ dedupe |
| `app/services/page.tsx`, `app/services/[slug]/page.tsx` | Both-counties wording |
| `app/globals.css` | 24px breadcrumb and checkbox targets |
| `tests/i18n-parity.test.ts` (new), `tests/browser/spanish.spec.ts` | Parity tests |
| `scripts/ui-audit.mjs` (new) | Audit used for this report |
| `audit-reports/ui-ux/**` (new) | Evidence |

## J. Verification (actual results)

| Check | Result |
|---|---|
| `next build` | Pass |
| `tsc --noEmit` | Pass |
| `eslint .` | Pass |
| `npm test` | 30 tests: 29 pass, 1 skipped (`database.test.ts` needs a local database URL), 0 fail |
| `playwright test` | 34 pass, 0 fail, including the new parity test |
| Audit script, 220 checks after | 0 findings |
| axe | 0 violations |

One earlier Playwright run failed broadly because a stale `next start` process was serving a broken CSS file after an interrupted build. After a clean restart every test passed, and that run is the one reported.

## K. Remaining recommendations (need approval or more testing)

1. **Screen readers:** test with NVDA and VoiceOver, especially the request form and the FAQ disclosure widgets.
2. **Firefox and Safari:** run the same audit in both. `scripts/ui-audit.mjs` works with any Playwright browser.
3. **Hero calls to action:** the hero has three equally sized actions (Request, Call, Text). The brief suggests one primary and one secondary. Text messaging is a real contact channel the owner may want, so this was left for the owner to decide.
4. **Native-speaker review:** a native Spanish speaker familiar with Central Coast customers should read `config/content-es.ts`.
5. **Owner TODOs:** typical lead time, insurance and payment methods. These FAQs stay hidden in both languages until answered.
