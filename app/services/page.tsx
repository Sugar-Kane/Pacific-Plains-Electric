import Link from "next/link";
import {
  PageHero,
  ServiceGrid,
  Diagnostic,
  ContactCTA,
  AreaLinks,
} from "@/components/public";
import { business } from "@/config/business";
import { metadata as meta, JsonLd, graph, breadcrumbNode, webPageNode } from "@/lib/seo";
export const metadata = meta(
  "Electrical Services in SLO County | Pacific Plains Electric",
  "Residential and commercial electrical services in San Luis Obispo County: troubleshooting, repair, panel upgrades, EV chargers, lighting, and remodel wiring.",
  "/services",
  { absolute: true },
);
export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode("/services", "Electrical services"),
          breadcrumbNode([{ name: "Services", path: "/services" }]),
        )}
      />
      <PageHero
        eyebrow="Services"
        title="Electrical services in San Luis Obispo County"
        description={`${business.name} provides residential and commercial electrical services throughout San Luis Obispo County. Pick a service to request it, or read the details first.`}
      />
      <section className="section container">
        <ServiceGrid />
      </section>
      <Diagnostic />
      <section className="section container">
        <h2>Where we work</h2>
        <p className="lede">
          Every service is available throughout San Luis Obispo County and in Santa Barbara.{" "}
          <Link href="/service-areas">See all service areas</Link>.
        </p>
        <AreaLinks />
      </section>
      <ContactCTA />
    </>
  );
}
