import Image from "next/image";
import { business } from "@/config/business";
import {
  Actions,
  ContactCTA,
  Diagnostic,
  FaqList,
  OwnerSection,
  SectionHead,
  ServiceOverview,
} from "@/components/public";
import { metadata as meta, JsonLd, businessSchema } from "@/lib/seo";
export const metadata = meta(
  "Central Coast Electrician",
  "Electrical repairs and installations in San Luis Obispo County. $180 diagnostic visits. CSLB #1162180.",
  "/",
);
export default function Home() {
  return (
    <>
      <JsonLd data={businessSchema} />
      <section className="hero">
        <div className="container hero-content">
          <span className="eyebrow">San Luis Obispo County electrician</span>
          <h1>Electrical work for Central Coast homes and businesses.</h1>
          <p className="lede">
            Repairs, panel upgrades, EV chargers, and lighting. Tell us about
            the job and we’ll take it from there.
          </p>
          <Actions />
          <p className="hero-meta">
            Owned by {business.owner} · {business.license}
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
      <section className="section container">
        <SectionHead
          eyebrow="Services"
          title="What we can help with"
          link={{ label: "All services", href: "/services" }}
        />
        <ServiceOverview
          slugs={[
            "electrical-repair",
            "panel-upgrades",
            "ev-charger-installation",
            "lighting",
            "new-construction",
            "commercial-electrical",
          ]}
        />
      </section>
      <Diagnostic />
      <OwnerSection />
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
