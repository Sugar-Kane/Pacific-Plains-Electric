import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/config/content";
import { business } from "@/config/business";
import { PageHero, PricingPanel, ContactCTA } from "@/components/public";
import { metadata as meta, JsonLd } from "@/lib/seo";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s
    ? meta(s.name, s.description, "/services/" + slug)
    : { title: "Service not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: {
            "@type": "Electrician",
            name: business.name,
            url: business.siteUrl,
          },
          areaServed: business.serviceArea,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: business.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: business.siteUrl + "/services",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: s.name,
              item: business.siteUrl + "/services/" + s.slug,
            },
          ],
        }}
      />
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: s.name }]}
        title={s.name}
        description={s.description}
      />
      <section className="section container two-column">
        <div>
          <h2>What’s included</h2>
          <ul className="check-list">
            {s.includes.map((x) => (
              <li key={x}>
                <Check size={18} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
          <h2>Request this service</h2>
          <p>
            Tell us about the property, the problem or project, and when works
            for you. We’ll review it and get back to you to set up the next
            step.
          </p>
          <Link className="button" href={"/request-service?service=" + s.slug}>
            Request service <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <h2 className="subhead">Other services</h2>
          <ul className="related">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={"/services/" + o.slug}>{o.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <PricingPanel />
      </section>
      <ContactCTA />
    </>
  );
}
