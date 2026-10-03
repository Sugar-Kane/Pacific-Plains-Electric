import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/config/content";
import { PageHero, ContactCTA } from "@/components/public";
import { ServiceIcon } from "@/components/icons";
import { metadata as meta } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = meta(
  "From the Blog",
  "Practical electrical planning notes for Central Coast homeowners, from EV charging to outdoor lighting.",
  "/blog",
);
export default async function Page() {
  const posts = await getContent("article");
  return (
    <>
      <PageHero
        eyebrow="THE PACIFIC PLAINS JOURNAL"
        title="A little electrical know-how."
        description="Planning notes and practical questions for your next electrical project."
      />
      <section className="section container">
        <div className="article-grid">
          {articles.map((a, i) => (
            <Link
              className="article-card"
              href={"/blog/" + a.slug}
              key={a.slug}
            >
              <div className={"article-art art-" + i}>
                <ServiceIcon
                  name={["CarFront", "PanelsTopLeft", "Lamp"][i]}
                  size={72}
                />
                <span>PACIFIC PLAINS FIELD NOTES</span>
              </div>
              <small>{a.category}</small>
              <h3>{a.title}</h3>
              <p>{a.dek}</p>
              <span className="text-link">
                Read article <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
          {posts.map((p) => (
            <Link
              className="article-card panel"
              href={"/blog/" + p.slug}
              key={p.id}
            >
              <small>{p.category}</small>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <span className="text-link">
                Read article <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
