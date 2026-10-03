import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { services } from "@/config/content";
import { business } from "@/config/business";
import { PageHero, Breadcrumb, ContactCTA } from "@/components/public";
import { ServiceIcon } from "@/components/icons";
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
        eyebrow="ELECTRICAL SERVICES · SAN LUIS OBISPO COUNTY"
        title={s.name}
        description={s.short}
      />
      <Breadcrumb
        items={[{ label: "Services", href: "/services" }, { label: s.name }]}
      />
      <section className="section container two-column">
        <div>
          <ServiceIcon name={s.icon} size={52} />
          <h2 style={{ marginTop: 25 }}>{s.short}</h2>
          <p>{s.description}</p>
          <ul className="check-list">
            {s.includes.map((x) => (
              <li key={x}>
                <Check size={18} />
                {x}
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 35 }}>Start with a conversation.</h3>
          <p>
            Tell us about your property, the issue or project, and your
            preferred times. We’ll review your request and help coordinate the
            next step.
          </p>
          <Link className="button" href={"/request-service?service=" + s.slug}>
            Request {s.name} <ArrowUpRight size={17} />
          </Link>
        </div>
        <aside className="panel">
          <span className="eyebrow">CLEAR FROM THE START</span>
          <h2>Electrical diagnostic</h2>
          <div className="price-display">
            ${business.diagnosticPrice}
            <small> / visit</small>
          </div>
          <p>
            Professional troubleshooting and evaluation. Repair and project work
            are quoted separately. The fee is not automatically credited toward
            repairs.
          </p>
          <hr />
          <p>
            {business.license}
            <br />
            Serving San Luis Obispo County
          </p>
          <a href={business.workPhone.tel} className="text-link">
            Call {business.workPhone.display}
          </a>
        </aside>
      </section>
      <ContactCTA />
    </>
  );
}
