import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/config/content";
import { PageHero, ContactCTA } from "@/components/public";
import { ServiceIcon } from "@/components/icons";
import { metadata as meta } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
const art: Record<string, string> = {
  "planning-an-ev-charger": "CarFront",
  "when-to-discuss-a-panel-upgrade": "PanelsTopLeft",
  "planning-outdoor-lighting": "Lamp",
};
export const metadata = meta(
  "Planning Guides",
  "Practical electrical planning notes for Central Coast homeowners, from EV charging to outdoor lighting.",
  "/blog",
);
export default async function Page() {
  const posts = await getContent("article");
  const cards = [
    ...articles.map((a) => ({
      slug: a.slug,
      category: a.category,
      title: a.title,
      excerpt: a.dek,
      icon: art[a.slug],
    })),
    ...posts.map((p) => ({ ...p, icon: undefined })),
  ];
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Planning guides"
        description="Short, practical notes to help you plan an electrical project before you call."
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
