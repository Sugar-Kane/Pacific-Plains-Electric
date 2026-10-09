/**
 * Crawls every URL in the sitemap of a running build and checks the basics:
 *   npm run build && npm start   (in another terminal)
 *   node scripts/seo-audit.mjs http://127.0.0.1:3000
 *
 * Checks: status, one <h1>, unique titles and descriptions, description
 * length, canonical URL, robots meta, Open Graph image, and that every
 * JSON-LD block parses, references only defined @ids, and carries no rating
 * markup. Also checks robots.txt, llms.txt, and private-route headers.
 */
const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const SITE = "https://www.pacificplainselectric.com";
const problems = [];
const warn = (url, msg) => problems.push(`${url.replace(SITE, "") || "/"}: ${msg}`);
const attr = (html, re) => html.match(re)?.[1];

const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const titles = new Map();
const descriptions = new Map();
const ids = new Set();
const refs = [];
let schemaBlocks = 0;

for (const url of urls) {
  const res = await fetch(url.replace(SITE, base), { redirect: "manual" });
  if (res.status !== 200) {
    warn(url, `status ${res.status}`);
    continue;
  }
  const html = await res.text();
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  const og = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) warn(url, "missing <title>");
  else {
    if (title.length > 65) warn(url, `title ${title.length} chars: ${title}`);
    if (titles.has(title)) warn(url, `duplicate title with ${titles.get(title)}`);
    titles.set(title, url);
  }
  if (!desc) warn(url, "missing meta description");
  else {
    const n = desc.replace(/&#x27;|&amp;|&quot;/g, "x").length;
    if (n < 120 || n > 165) warn(url, `description ${n} chars`);
    if (descriptions.has(desc)) warn(url, `duplicate description with ${descriptions.get(desc)}`);
    descriptions.set(desc, url);
  }
  if (canonical !== url && !(url === SITE && canonical === SITE))
    warn(url, `canonical is ${canonical}`);
  if (robots && /noindex/.test(robots)) warn(url, `in sitemap but robots="${robots}"`);
  if (!og) warn(url, "missing og:image");
  if (h1s !== 1) warn(url, `${h1s} <h1> elements`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    schemaBlocks++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      warn(url, "JSON-LD does not parse");
      continue;
    }
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      if (node["@id"] && Object.keys(node).length > 1) ids.add(node["@id"]);
      else if (node["@id"]) refs.push([url, node["@id"]]);
      if ("aggregateRating" in node || "review" in node) warn(url, "rating/review markup present");
      Object.values(node).forEach(walk);
    };
    walk(data);
  }
}
for (const [url, id] of refs) if (!ids.has(id)) warn(url, `unresolved @id ${id}`);

const robots = await (await fetch(base + "/robots.txt")).text();
for (const path of ["/admin", "/api/", "/auth/", "/appointment/"])
  if (!robots.includes(`Disallow: ${path}`)) warn("/robots.txt", `does not disallow ${path}`);
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) warn("/robots.txt", "missing sitemap line");
if (/\/admin|\/api\//.test(sitemap)) warn("/sitemap.xml", "lists a private route");

const llms = await fetch(base + "/llms.txt");
if (llms.status !== 200 || !(await llms.text()).startsWith("# Pacific Plains Electric"))
  warn("/llms.txt", "missing or malformed");

const admin = await fetch(base + "/admin", { redirect: "manual" });
const adminHtml = await admin.text();
if (!/noindex/.test(admin.headers.get("x-robots-tag") || "") && !/name="robots" content="noindex/.test(adminHtml))
  warn("/admin", "not marked noindex");

console.log(`Checked ${urls.length} sitemap URLs, ${schemaBlocks} JSON-LD blocks, ${ids.size} defined @ids.`);
console.log(problems.length ? problems.map((p) => "  - " + p).join("\n") : "No problems found.");
process.exit(problems.length ? 1 : 0);
