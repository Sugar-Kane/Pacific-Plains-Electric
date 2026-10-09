import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/config/content";
import { PageHero, ContactCTA } from "@/components/public";
import { ServiceIcon } from "@/components/icons";
import { metadata as meta, JsonLd, graph, breadcrumbNode, webPageNode } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = meta(
  "Electrical Planning Guides",
  "Practical guides for San Luis Obispo County homeowners: breaker trips, panel upgrades, 100 vs 200 amp service, EV chargers, GFCI and AFCI, and outdoor lighting.",
  "/blog",
);
export default async function Page() {
  const posts = await getContent("article");
  const cards = [
    ...articles.map((a) => ({ slug: a.slug, category: a.category, title: a.title, excerpt: a.dek, icon: a.icon })),
    ...posts.map((p) => ({ slug: p.slug, category: p.category, title: p.title, excerpt: p.excerpt, icon: undefined })),
  ];
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode("/blog", "Planning guides", { "@type": "CollectionPage" }),
          breadcrumbNode([{ name: "Guides", path: "/blog" }]),
        )}
      />
      <PageHero
        eyebrow="Guides"
        title="Electrical planning guides"
        description="Short, practical answers to the questions we hear most from homeowners in San Luis Obispo County."
      />
      <section className="section container">
        <div className="article-grid">
          {cards.map((c) => (
            <Link className="article-card" href={"/blog/" + c.slug} key={c.slug}>
              {c.icon && (
                <div className="article-art">
                  <ServiceIcon name={c.icon} size={56} />
                </div>
              )}
              <div className="article-card-body">
                <span className="eyebrow">{c.category}</span>
                <h2>{c.title}</h2>
                <p>{c.excerpt}</p>
                <span className="service-card-more">
                  Read the guide <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
