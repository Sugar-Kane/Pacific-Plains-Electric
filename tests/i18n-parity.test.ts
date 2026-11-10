import test from "node:test";
import assert from "node:assert/strict";

import { services, answeredFaqs, process, listedServices } from "../config/content";
import { publishedAreas } from "../config/areas";
import { intakeCategories } from "../config/intake";
import { servicesEs, areasEs, faqsEs, processEs } from "../config/content-es";
import { serviceNamesEs, serviceSummariesEs, translatedPaths } from "../lib/i18n/shared";
import { business } from "../config/business";

/*
 * English and Spanish must offer the same information. These fail when a
 * service, area, FAQ or list item is added to one language and not the other.
 */

test("every service has Spanish content with the same lists", () => {
  for (const s of services) {
    const es = servicesEs[s.slug];
    assert.ok(es, `no Spanish content for ${s.slug}`);
    assert.ok(serviceNamesEs[s.slug], `no Spanish name for ${s.slug}`);
    assert.ok(serviceSummariesEs[s.slug], `no Spanish summary for ${s.slug}`);
    assert.equal(es.overview.length, s.overview.length, `${s.slug} overview`);
    assert.equal(es.reasons.length, s.reasons.length, `${s.slug} reasons`);
    assert.equal(es.includes.length, s.includes.length, `${s.slug} includes`);
    assert.equal(es.warningSigns?.length ?? 0, s.warningSigns?.length ?? 0, `${s.slug} warning signs`);
    assert.equal(es.faqs.length, s.faqs.filter((f) => f.a).length, `${s.slug} FAQs`);
  }
  assert.deepEqual(Object.keys(servicesEs).sort(), services.map((s) => s.slug).sort());
});

test("the home page service cards have Spanish names and summaries", () => {
  for (const c of intakeCategories) {
    assert.ok(serviceNamesEs[c.slug], c.slug);
    assert.ok(serviceSummariesEs[c.slug], c.slug);
  }
  assert.ok(listedServices.length > 0);
});

test("the FAQ and the steps have the same number of entries in both languages", () => {
  assert.equal(faqsEs.length, answeredFaqs.length);
  assert.equal(processEs.length, process.length);
});

test("every service area has Spanish content with the same considerations", () => {
  for (const a of publishedAreas) {
    const es = areasEs[a.slug];
    assert.ok(es, `no Spanish content for ${a.slug}`);
    assert.equal(es.considerations.length, a.considerations.length, a.slug);
  }
});

test("prices, license and phone number are the same in Spanish", () => {
  const spanish = JSON.stringify([servicesEs, faqsEs, areasEs]);
  assert.ok(spanish.includes(`$${business.diagnosticPrice}`));
  assert.ok(!/\$1[0-79]\d\b/.test(spanish.replaceAll(`$${business.diagnosticPrice}`, "")), "a different diagnostic price appears");
  assert.ok(spanish.includes(business.license));
  assert.ok(spanish.includes(business.workPhone.display));
});

test("every translated page path has a Spanish route", () => {
  for (const p of ["/", "/services", "/about", "/contact", "/service-areas", "/request-service", "/faq", "/privacy", "/terms", "/accessibility"]) {
    assert.ok(translatedPaths.includes(p), p);
  }
});
