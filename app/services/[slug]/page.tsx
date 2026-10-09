import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, TriangleAlert } from "lucide-react";
import { services, findService } from "@/config/content";
import { business } from "@/config/business";
import {
  PageHero,
  PricingPanel,
  ContactCTA,
  ProcessSteps,
  AreaLinks,
  FaqList,
} from "@/components/public";
import {
  metadata as meta,
  JsonLd,
  graph,
  serviceNode,
  breadcrumbNode,
  faqNode,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = findService((await params).slug);
  return s
    ? meta(s.metaTitle, s.metaDescription, "/services/" + s.slug, { absolute: true })
    : { title: "Service not found" };
}

export default async function Page({ params }: Props) {
  const s = findService((await params).slug);
  if (!s) notFound();
  const path = "/services/" + s.slug;
  const faqs = s.faqs.filter((f): f is { q: string; a: string } => !!f.a);
  const related = s.related.map(findService).filter((x) => x !== undefined);
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode(s),
          breadcrumbNode([
            { name: "Services", path: "/services" },
            { name: s.name, path },
          ]),
          ...(faqs.length ? [faqNode(faqs, path)] : []),
        )}
      />
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: s.name }]}
        title={`${s.name} in San Luis Obispo County`}
        description={s.description}
      />
      <section className="section container two-column">
        <div className="prose service-body">
          <h2>About this service</h2>
          {s.overview.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
          <h2>Common reasons to call</h2>
          <ul className="check-list">
            {s.reasons.map((x) => (
              <li key={x}>
                <Check size={18} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
          {s.warningSigns && (
            <>
              <h2>Warning signs</h2>
              <ul className="check-list warning-list">
                {s.warningSigns.map((x) => (
                  <li key={x}>
                    <TriangleAlert size={18} aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="notice">
                If you see sparks, smoke, or fire, move away and call 911. If
                it’s safe to reach, turn off the breaker for that circuit.
              </p>
            </>
          )}
          <h2>What we do</h2>
          <ul className="check-list">
            {s.includes.map((x) => (
              <li key={x}>
                <Check size={18} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
          <Link className="button" href={"/request-service?service=" + s.requestAs}>
            Request service <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <PricingPanel />
      </section>
      <section className="section band">
        <div className="container">
          <span className="eyebrow">What to expect</span>
          <h2>How it works</h2>
          <ProcessSteps />
        </div>
      </section>
      <section className="section container">
        <span className="eyebrow">Service area</span>
        <h2>Where we offer {s.name}</h2>
        <p className="lede">
          {business.name} serves {s.audience.toLowerCase()} customers
          throughout San Luis Obispo County, including:
        </p>
        <AreaLinks />
      </section>
      {faqs.length > 0 && (
        <section className="section container faq-grid">
          <div className="section-head">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2>{s.name} questions</h2>
            </div>
          </div>
          <FaqList items={faqs} />
        </section>
      )}
      {related.length > 0 && (
        <section className="section container">
          <h2 className="subhead">Related services</h2>
          <ul className="related">
            {related.map((o) => (
              <li key={o.slug}>
                <Link href={"/services/" + o.slug}>{o.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ContactCTA />
    </>
  );
}
