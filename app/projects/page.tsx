import { FolderOpen } from "lucide-react";
import { PageHero, ContactCTA } from "@/components/public";
import { metadata as meta } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = meta(
  "Projects",
  "Electrical project updates from Pacific Plains Electric in San Luis Obispo County.",
  "/projects",
);
export default async function Page() {
  const posts = await getContent("project");
  return (
    <>
      <PageHero
        eyebrow="OUR WORK"
        title="Electrical projects"
        description="Panel upgrades, EV charging, lighting, residential, commercial, and new construction."
      />
      <section className="section container">
        {posts.length ? (
          <div className="article-grid">
            {posts.map((p) => (
              <article className="panel" key={p.id}>
                <small>{p.category}</small>
                <h2>{p.title}</h2>
                <p style={{ whiteSpace: "pre-wrap" }}>{p.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderOpen size={38} />
            <h2>Ask about a similar project</h2>
            <p>
              We’ll share completed work here when project details and photos
              are ready. Have a project in mind? Let’s talk about it.
            </p>
          </div>
        )}
      </section>
      <ContactCTA />
    </>
  );
}
