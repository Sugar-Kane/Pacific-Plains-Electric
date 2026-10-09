import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { business } from "@/config/business";
import { publishedAreas, findArea, countyOf } from "@/config/areas";
import { findService } from "@/config/content";
import { ServiceIcon } from "@/components/icons";
import { PageHero, ContactCTA, PricingPanel, FaqList } from "@/components/public";
import {
  metadata as meta,
  JsonLd,
  graph,
  breadcrumbNode,
  webPageNode,
  faqNode,
  BUSINESS_ID,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedAreas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const a = findArea((await params).slug);
  if (!a) return { title: "Service area not found" };
  return meta(
    `Electrician in ${a.name}, CA | ${business.name}`,
    `${business.name} is a licensed electrician serving ${a.name}, CA: troubleshooting, repairs, panel upgrades, EV chargers, and lighting.`,
    "/service-areas/" + a.slug,
    { absolute: true },
  );
}

export default async function Page({ params }: Props) {
  const a = findArea((await params).slug);
  if (!a) notFound();
  const path = "/service-areas/" + a.slug;
  const services = a.services.map(findService).filter((x) => x !== undefined);
  const nearby = a.nearby.map(findArea).filter((x) => x !== undefined);
  // Without close neighbors, link the rest of the service area instead.
  const linked = nearby.length ? nearby : publishedAreas.filter((x) => x.slug !== a.slug);
  const faqs = [
    {
      q: `Does ${business.name} serve ${a.name}?`,
      a: `Yes. ${a.name}, in ${countyOf(a)}, is part of our service area. We come to you; there is no office in ${a.name}. Contact us to confirm service for your address.`,
    },
    {
      q: `Who issues electrical permits in ${a.name}?`,
      a:
        a.kind === "community"
          ? `${a.name} is unincorporated, so permits are issued by ${a.permitAuthority}.`
          : `Permits for work in ${a.name} are issued by ${a.permitAuthority}.`,
    },
    {
      q: `How much is a diagnostic visit in ${a.name}?`,
      a: `A diagnostic visit is $${business.diagnosticPrice}, the same throughout our service area. Repairs and project work are quoted separately.`,
    },
  ];
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode(path, `Electrician in ${a.name}, CA`, {
            about: { "@id": BUSINESS_ID },
            mentions: { "@type": "Place", name: `${a.name}, CA`, sameAs: a.wikipedia },
          }),
          breadcrumbNode([
            { name: "Service areas", path: "/service-areas" },
            { name: a.name, path },
          ]),
          faqNode(faqs, path),
        )}
      />
      <PageHero
        crumbs={[{ label: "Service areas", href: "/service-areas" }, { label: a.name }]}
        title={`Electrician in ${a.name}, CA`}
        description={a.intro}
      />
      <section className="section container two-column">
        <div className="prose">
          <h2>Electrical work in {a.name}</h2>
          {a.considerations.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
          <h3>
            <Landmark size={20} aria-hidden="true" className="inline-icon" /> Permits
          </h3>
          <p>
            {a.kind === "community"
              ? `${a.name} is an unincorporated community, so permitted electrical work goes through ${a.permitAuthority}.`
              : `Permitted electrical work in ${a.name} goes through ${a.permitAuthority}.`}{" "}
            We’ll go over permit requirements with your quote.
          </p>
        </div>
        <PricingPanel />
      </section>
      <section className="section band">
        <div className="container">
          <span className="eyebrow">Services</span>
          <h2>Common requests in {a.name}</h2>
          <div className="service-grid">
            {services.map((s) => (
              <Link className="service-card" href={"/services/" + s.slug} key={s.slug}>
                <span className="service-icon">
                  <ServiceIcon name={s.icon} size={24} />
                </span>
                <h3>{s.name}</h3>
                <p>{s.summary}</p>
                <span className="service-card-more">
                  Learn more <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <p>
            <Link className="text-link" href="/services">
              See all electrical services <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>
      <section className="section container faq-grid">
        <div className="section-head">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>{a.name} questions</h2>
          </div>
        </div>
        <FaqList items={faqs} />
      </section>
      {linked.length > 0 && (
        <section className="section container">
          <h2 className="subhead">
            {nearby.length ? "Nearby communities we serve" : "Other communities we serve"}
          </h2>
          <ul className="related">
            {linked.map((n) => (
              <li key={n.slug}>
                <Link href={"/service-areas/" + n.slug}>{n.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/service-areas">All service areas</Link>
            </li>
          </ul>
        </section>
      )}
      <ContactCTA />
    </>
  );
}
