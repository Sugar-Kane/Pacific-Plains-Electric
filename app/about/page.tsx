import Link from "next/link";
import { PageHero, OwnerSection, Facts, ContactCTA } from "@/components/public";
import { business, diagnosticTerms } from "@/config/business";
import { listedServices } from "@/config/content";
import { publishedAreas } from "@/config/areas";
import { metadata as meta, JsonLd, graph, breadcrumbNode, webPageNode } from "@/lib/seo";
export const metadata = meta(
  "About Pacific Plains Electric",
  "Pacific Plains Electric is a licensed electrical contractor owned by Nicholas Kane, serving homes and businesses across San Luis Obispo County. CSLB #1162180.",
  "/about",
);
export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode("/about", "About Pacific Plains Electric", { "@type": "AboutPage" }),
          breadcrumbNode([{ name: "About", path: "/about" }]),
        )}
      />
      <PageHero
        eyebrow="About"
        title="About Pacific Plains Electric"
        description={business.description}
      />
      <OwnerSection aboutLink={false} />
      <section className="container">
        <Facts />
      </section>
      <section className="section container">
        <div className="prose">
          <h2>What we do</h2>
          <p>
            {business.name} is an electrical contractor, licensed in California
            as {business.license} and owned by {business.owner}. The business
            handles electrical troubleshooting and repair, panel upgrades, EV
            charger installation, lighting, dedicated circuits, remodel and new
            construction wiring, and commercial electrical work.
          </p>
          <ul className="related">
            {listedServices.map((s) => (
              <li key={s.slug}>
                <Link href={"/services/" + s.slug}>{s.name}</Link>
              </li>
            ))}
          </ul>
          <h2>Where we work</h2>
          <p>
            We serve homes and businesses throughout {business.serviceArea},
            including {publishedAreas.slice(0, -1).map((a) => a.name).join(", ")},
            and {publishedAreas.at(-1)!.name}. We come to you; there is no
            public storefront. <Link href="/service-areas">See service areas</Link>.
          </p>
          <h2>How we work</h2>
          <p>
            A diagnostic visit is ${business.diagnosticPrice}.{" "}
            {diagnosticTerms} New work is quoted before it begins, and
            questions go straight to the owner.
          </p>
          <h2>How to reach us</h2>
          <p>
            For service, call the main line at{" "}
            <a href={business.workPhone.tel}>{business.workPhone.display}</a>.
            It’s answered by an automated phone assistant, so you can call any
            time. To reach Nicholas directly, email <a href={"mailto:" + business.email}>{business.email}</a>.
            Office hours are {business.hours.display}, and visits are scheduled
            by appointment.
          </p>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
