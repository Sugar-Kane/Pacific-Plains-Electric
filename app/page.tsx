import HeroBeach from "@/components/hero-beach";
import { answeredFaqs } from "@/config/content";
import { business } from "@/config/business";
import {
  Actions,
  AreaLinks,
  ContactCTA,
  Diagnostic,
  FaqList,
  OwnerSection,
  Reviews,
  SectionHead,
  ServiceChoices,
  ProcessSteps,
} from "@/components/public";
import { metadata as meta, JsonLd, graph, webPageNode } from "@/lib/seo";
export const metadata = meta(
  "Pacific Plains Electric | SLO & Santa Barbara County Electrician",
  "Licensed electrician serving San Luis Obispo and Santa Barbara Counties. Troubleshooting, repairs, panel upgrades, EV chargers, and lighting for homes and businesses.",
  "/",
  { absolute: true },
);
const homeFaqs = [
  answeredFaqs[1],
  answeredFaqs.find((f) => f.q.includes("schedule"))!,
  answeredFaqs[0],
  answeredFaqs[2],
];
export default function Home() {
  return (
    <>
      <JsonLd data={graph(webPageNode("/", business.name))} />
      <section className="hero hero-with-beach">
        <HeroBeach />
        <div className="container hero-content">
          <span className="eyebrow">
            Licensed electrical contractor · {business.license}
          </span>
          <h1>
            Need an Electrician?
            <br />
            We Can Help.
          </h1>
          <p className="lede">
            Electrical repairs, troubleshooting, panel upgrades, EV chargers,
            and more throughout San Luis Obispo and Santa Barbara counties.
          </p>
          <Actions />
          <p className="hero-meta">
            Owned by {business.owner} · $180 diagnostic visit, credited toward
            qualifying approved follow-up repairs.
          </p>
        </div>
      </section>
      <section className="section container home-services">
        <SectionHead
          eyebrow="Electrical services"
          title="What do you need help with?"
          link={{ label: "View all services", href: "/services" }}
        />
        <ServiceChoices />
      </section>
      <section className="section container">
        <SectionHead eyebrow="Three simple steps" title="How it works" />
        <ProcessSteps />
      </section>
      <Diagnostic />
      <section className="section container">
        <SectionHead
          eyebrow="Service areas"
          title="Proudly serving the Central Coast"
          link={{ label: "All service areas", href: "/service-areas" }}
        />
        <p>
          Electrical services throughout San Luis Obispo and Santa Barbara
          counties. Contact us to confirm coverage for your address.
        </p>
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
        <FaqList items={homeFaqs} />
      </section>
      <ContactCTA />
    </>
  );
}
