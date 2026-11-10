// UI/UX audit: every important route, English and Spanish, at ten viewports.
// Records horizontal overflow, controls clipped off-screen, small touch targets,
// console errors, failed requests and axe WCAG 2.2 A/AA violations, and takes
// full-page screenshots at representative sizes.
//
//   node scripts/ui-audit.mjs <label> [baseURL]
//
// Writes audit-reports/ui-ux/<label>/results.json and screenshots/.
// Never submits a form.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const label = process.argv[2] || "run";
const base = process.argv[3] || "http://127.0.0.1:3000";
const out = `audit-reports/ui-ux/${label}`;
mkdirSync(`${out}/screenshots`, { recursive: true });

const routes = [
  "/", "/services", "/services/ev-charger-installation", "/request-service", "/contact",
  "/faq", "/service-areas", "/about", "/privacy", "/terms", "/accessibility",
];
const viewports = [
  [320, 568], [375, 667], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 800], [1366, 768], [1920, 1080], [2560, 1440],
];
const screenshotAt = new Set(["375x667", "768x1024", "1280x800"]);
const axeAt = new Set(["375x667", "1280x800"]);

const executablePath = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const browser = await chromium.launch({ executablePath: executablePath.endsWith("chromium") ? undefined : executablePath }).catch(() => chromium.launch());
const results = [];

for (const lang of ["en", "es"]) {
  for (const route of routes) {
    const path = lang === "es" ? (route === "/" ? "/es" : "/es" + route) : route;
    for (const [w, h] of viewports) {
      const vp = `${w}x${h}`;
      const context = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
      const page = await context.newPage();
      const consoleErrors = [];
      const failed = [];
      page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200)); });
      page.on("pageerror", (e) => consoleErrors.push("pageerror: " + String(e).slice(0, 200)));
      page.on("requestfailed", (r) => { if (!/google|vercel-insights|_vercel/.test(r.url())) failed.push(r.url()); });
      page.on("response", (r) => { if (r.status() >= 400 && !/google|_vercel/.test(r.url())) failed.push(`${r.status()} ${r.url()}`); });
      const res = await page.goto(base + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(250);
      const layout = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - vw;
        const offscreen = [];
        const small = [];
        for (const el of document.querySelectorAll("a, button, input, select, textarea, summary, [role=button]")) {
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none" || el.closest("[hidden],[aria-hidden=true]")) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > vw + 1 || r.left < -1) offscreen.push((el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40));
          const inline = s.display === "inline" && el.closest("p, li, dd");
          if (!inline && (r.width < 24 || r.height < 24)) small.push(`${(el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        const h1 = document.querySelectorAll("h1").length;
        return { overflow, offscreen: offscreen.slice(0, 8), small: small.slice(0, 8), h1, lang: document.documentElement.lang, title: document.title };
      });
      let axe = null;
      if (axeAt.has(vp)) {
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        axe = scan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(" ") }));
      }
      if (screenshotAt.has(vp) && ["/", "/services", "/request-service", "/contact", "/faq", "/service-areas"].includes(route)) {
        await page.screenshot({ path: `${out}/screenshots/${lang}${route === "/" ? "-home" : route.replaceAll("/", "-")}-${vp}.jpg`, fullPage: true, type: "jpeg", quality: 60 });
      }
      results.push({ lang, path, vp, status: res?.status(), ...layout, consoleErrors, failed: [...new Set(failed)].slice(0, 5), axe });
      await context.close();
    }
    process.stdout.write(".");
  }
}
await browser.close();
writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 1));

const problems = results.filter((r) => r.overflow > 0 || r.offscreen.length || r.consoleErrors.length || r.failed.length || r.h1 !== 1 || (r.axe && r.axe.length) || r.status !== 200);
console.log(`\n${results.length} page-viewport checks, ${problems.length} with findings`);
for (const r of problems) {
  console.log(`${r.lang} ${r.path} ${r.vp} status=${r.status} overflow=${r.overflow} h1=${r.h1}` +
    (r.offscreen.length ? ` offscreen=${JSON.stringify(r.offscreen)}` : "") +
    (r.consoleErrors.length ? ` console=${JSON.stringify(r.consoleErrors.slice(0, 2))}` : "") +
    (r.failed.length ? ` failed=${JSON.stringify(r.failed)}` : "") +
    (r.axe && r.axe.length ? ` axe=${JSON.stringify(r.axe)}` : ""));
}
const smallSummary = {};
for (const r of results.filter((r) => r.vp === "375x667")) for (const s of r.small) smallSummary[s] = (smallSummary[s] || 0) + 1;
console.log("small targets at 375px (target, pages):", JSON.stringify(Object.entries(smallSummary).slice(0, 15)));
