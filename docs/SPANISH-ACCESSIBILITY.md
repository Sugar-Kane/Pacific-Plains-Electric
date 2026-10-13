# Spanish and accessibility release — October 13, 2026

## Behavior
- English URLs remain unchanged. Spanish customer pages are under /es, with corresponding canonical/hreflang metadata and sitemap entries.
- Visible English/Español control remembers the visitor's explicit choice for one year in a first-party cookie. Initial language selection uses supported Accept-Language preferences and their quality weights. It never infers ethnicity, identity, or language from a name/location. Direct /es URLs work regardless of the saved default.
- Service categories, contact actions, pricing/credit example, request fields, consent, errors, acknowledgment, county coverage, owner information, FAQ, privacy/terms and accessibility help are in Spanish. Service/area pages have concise Spanish versions. Detailed educational guides and owner tools remain English and are labeled accordingly.
- Requests record preferredLanguage en/es in the existing JSON payload. The owner view and notification content display the preference. The actual Spanish SMS consent text is saved when selected. No new database schema, billing behavior or live messaging activation is required.
- Auth, original API protections, scheduling settings, SEO URLs and existing integrations are retained.

## Accessibility work and evidence
WCAG 2.2 AA is the implementation target, not a legal certification. Correct document language, keyboard-operable language controls, skip-link target focus, localized labels/status/error/success feedback, 44px language control, reduced-motion support, forced-color outlines, narrow-screen wrapping and an accessibility contact page are included. Existing contrast/focus/form consent controls remain in place.

Executed production build and lint successfully. 27 Playwright tests passed, covering original English journeys plus Spanish auto-selection, saved override, service preselection, required text consent, preserved-input retry with the identical idempotency key, focused acknowledgment, all Spanish route canonicals and 320px reflow, keyboard skip/menu Escape, and 200% text enlargement. Axe checks with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags found no violations on the checked English/Spanish pages in light/dark themes. 16 unit/security tests passed; one environment-dependent database test was skipped. Browser submission success/failure is mocked: this is not a live customer message or end-to-end production database delivery test.

Manual browser review performed at mobile width. No independent screen-reader user audit or legal certification has been performed. Automated tests cannot establish full ADA compliance. Continue periodic testing after content changes; respond to accessibility assistance requests and obtain a qualified accessibility/manual assistive-technology audit for stronger assurance.

Sources reviewed: https://www.ada.gov/resources/web-guidance/ and https://www.w3.org/TR/WCAG22/. DOJ's private-business guidance concerns nondiscrimination and effective communication; state/local-government Title II web deadlines are not represented as requirements for this private business.

## Operations
The shared document layout reads a proxy-set language header to render the correct HTML language and navigation on the server. Public HTML is therefore dynamically rendered; assets remain cached. Real-user 75th-percentile Core Web Vitals require field data and were not established by this release. Language changes use full navigation so assistive technologies receive the new document language. Consent policy links open labeled new tabs so the form stays intact.

The separate Volteira handoff branch is preserved. Live activation still needs the actual Volteira Supabase project connection, verified organization configuration, and owner notification destination. This release does not activate automated SMS or silently translate existing conversations.
