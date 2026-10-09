import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CaliforniaMap from "@/components/california-map";
import { PageHero, ContactCTA } from "@/components/public";
import { business } from "@/config/business";
import { publishedAreas, countyOf, DEFAULT_COUNTY } from "@/config/areas";
import { metadata as meta, JsonLd, graph, breadcrumbNode, webPageNode } from "@/lib/seo";

export const metadata = meta(
  "Service Areas | Electrician in San Luis Obispo County",
  "Pacific Plains Electric serves homes and businesses across San Luis Obispo County and in Santa Barbara, including San Luis Obispo, Arroyo Grande, and Nipomo.",
  "/service-areas",
  { absolute: true },
);

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode("/service-areas", "Service areas"),
          breadcrumbNode([{ name: "Service areas", path: "/service-areas" }]),
        )}
      />
      <PageHero
        eyebrow="Service areas"
        title="Electrician serving San Luis Obispo County"
        description={`${business.name} provides residential and commercial electrical services throughout San Luis Obispo County and in Santa Barbara. We come to you; there is no public storefront.`}
      />
      <section className="section container two-column">
        <div>
          <h2>Communities we serve</h2>
          <ul className="area-cards">
            {publishedAreas.map((a) => (
              <li key={a.slug}>
                <Link className="area-card" href={"/service-areas/" + a.slug}>
                  <strong>{a.name}</strong>
                  <span>
                    {countyOf(a) !== DEFAULT_COUNTY
                      ? countyOf(a)
                      : a.setting === "coastal"
                      ? "Coastal"
                      : a.setting === "inland"
                        ? "North County"
                        : "Central and South County"}
                    {a.kind === "community" ? " · unincorporated" : ""}
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Don’t see your town? We work throughout San Luis Obispo County.{" "}
            <Link className="inline-link" href="/contact">
              Contact us
            </Link> to confirm service for your
            address.
          </p>
        </div>
        <div className="map-panel">
          <CaliforniaMap />
          <h2>San Luis Obispo County</h2>
          <p className="map-legend">
            <span /> Our service area
          </p>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
