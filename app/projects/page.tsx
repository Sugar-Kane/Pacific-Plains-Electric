import { FolderOpen } from "lucide-react";
import { PageHero, ContactCTA } from "@/components/public";
import { metadata as meta } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
// Keep the page out of search results until real projects are published.
export async function generateMetadata() {
  const posts = await getContent("project");
  return meta(
    "Electrical Projects",
    "Completed electrical projects from Pacific Plains Electric in San Luis Obispo County: panel upgrades, EV chargers, lighting, and remodel wiring.",
    "/projects",
    { noindex: posts.length === 0 },
  );
}
export default async function Page() {
  const posts = await getContent("project");
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Recent projects"
        description="Panel upgrades, EV charging, lighting, residential, commercial, and new construction."
      />
      <section className="section container">
        {posts.length ? (
          <div className="article-grid">
            {posts.map((p) => (
              <article className="panel" key={p.id}>
                <span className="eyebrow">{p.category}</span>
                <h2>{p.title}</h2>
                <p className="pre-wrap">{p.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderOpen size={38} />
            <h2>Ask about a similar project</h2>
            <p>
              Completed work will be posted here with photos. In the meantime,
              ask us about a project like yours.
            </p>
          </div>
        )}
      </section>
      <ContactCTA />
    </>
  );
}
