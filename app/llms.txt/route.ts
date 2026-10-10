import { business, diagnosticTerms } from "@/config/business";
import { listedServices, answeredFaqs, articles } from "@/config/content";
import { publishedAreas, countyOf, DEFAULT_COUNTY } from "@/config/areas";

/**
 * /llms.txt: a plain-text summary of the business for AI search tools,
 * generated from the same config as the site so the facts always match.
 * It complements, and does not replace, the sitemap and structured data.
 */
export const dynamic = "force-static";

export function GET() {
  const url = business.siteUrl;
  const hours = business.hours.days
    ? `${business.hours.days.join(", ")}, ${business.hours.display}`
    : business.hours.display;
  const home = publishedAreas.filter((a) => countyOf(a) === DEFAULT_COUNTY);
  const beyond = publishedAreas.filter((a) => countyOf(a) !== DEFAULT_COUNTY);
  const area =
    `${business.serviceArea}, including ${home.map((a) => a.name).join(", ")}` +
    beyond.map((a) => `; also ${a.name} (${countyOf(a)})`).join("");
  const body = `# ${business.name}

> ${business.name} is an electrical contractor serving ${business.serviceArea}.

${business.description} The business is owned by ${business.owner} and licensed by the California Contractors State License Board as ${business.license}. It is a service-area business with no public storefront; visits to homes and businesses are scheduled by appointment.

## Key facts

- Business type: electrician / electrical contractor (residential and commercial)
- Service area: ${area}
- Phone: ${business.workPhone.display} (main line, answered by an automated assistant)
- Email: ${business.email}
- Hours: ${hours}
- Diagnostic visit: $${business.diagnosticPrice}. ${diagnosticTerms}
- Online booking: not available; send a service request and the business confirms a time
- Website: ${url}

## Main pages

- [Home](${url}/): overview, services, and how to get in touch
- [Services](${url}/services): all electrical services
- [Service areas](${url}/service-areas): communities served in San Luis Obispo County
- [About](${url}/about): the business, owner, license, and how it works
- [Request service](${url}/request-service): online service request form
- [Contact](${url}/contact): phone, text, email, and hours
- [FAQ](${url}/faq): common questions

## Services

${listedServices.map((s) => `- [${s.name}](${url}/services/${s.slug}): ${s.description}`).join("\n")}

## Service areas

${publishedAreas.map((a) => `- [${a.name}, CA](${url}/service-areas/${a.slug})`).join("\n")}

## Guides

${articles.map((a) => `- [${a.title}](${url}/blog/${a.slug}): ${a.dek}`).join("\n")}

## FAQ

${answeredFaqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
