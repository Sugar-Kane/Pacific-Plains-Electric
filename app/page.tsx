import Image from "next/image";
import { business } from "@/config/business";
import PoweredHouse from "@/components/powered-house";
import {
  Actions,
  AreaLinks,
  ContactCTA,
  Diagnostic,
  Facts,
  FaqList,
  OwnerSection,
  Reviews,
  SectionHead,
  ServiceOverview,
} from "@/components/public";
import { metadata as meta, JsonLd, graph, webPageNode } from "@/lib/seo";
export const metadata = meta(
  "Pacific Plains Electric | SLO & Santa Barbara County Electrician",
  "Licensed electrician serving San Luis Obispo and Santa Barbara Counties. Troubleshooting, repairs, panel upgrades, EV chargers, and lighting for homes and businesses.",
  "/",
  { absolute: true },
);
export default function Home() {
  return (
    <>
      <JsonLd data={graph(webPageNode("/", business.name))} />
      <section className="hero">
        <div className="container hero-content">
          <span className="eyebrow">Licensed electrical contractor · {business.license}</span>
          <h1>Electrician serving San Luis Obispo and Santa Barbara Counties</h1>
          <p className="lede">
            {business.name} provides residential and commercial electrical
            services across the Central Coast, from troubleshooting and repairs to
            panel upgrades, EV chargers, and lighting.
          </p>
          <Actions />
          <p className="hero-meta">
            Owned by {business.owner} · ${business.diagnosticPrice} diagnostic visits
          </p>
        </div>
        <div className="hero-image">
          <Image
            src="/images/central-coast.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
      </section>
      <section className="container hero-facts" aria-label="At a glance">
        <Facts />
      </section>
      <PoweredHouse />
      <section className="section container">
        <SectionHead
          eyebrow="Services"
          title="What we can help with"
          link={{ label: "All services", href: "/services" }}
        />
        <ServiceOverview
          slugs={[
            "troubleshooting",
            "electrical-repair",
            "panel-upgrades",
            "ev-charger-installation",
            "lighting",
            "commercial-electrical",
          ]}
        />
      </section>
      <Diagnostic />
      <section className="section container">
        <SectionHead
          eyebrow="Service areas"
          title="Serving San Luis Obispo County and Santa Barbara"
          link={{ label: "All service areas", href: "/service-areas" }}
        />
        <AreaLinks />
      </section>
      <OwnerSection />
      <Reviews />
      <section className="section container faq-grid">
        <SectionHead
          eyebrow="FAQ"
          title="Common questions"
          link={{ label: "All questions", href: "/faq" }}
        />
        <FaqList limit={4} />
      </section>
      <ContactCTA />
    </>
  );
}
