import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { findArticle, findService } from "@/config/content";
import { PageHero, ContactCTA } from "@/components/public";
import { metadata as meta, JsonLd, graph, articleNode, breadcrumbNode } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const a = findArticle(slug);
  if (a) return { kind: "static" as const, a };
  const p = (await getContent("article")).find((x) => x.slug === slug);
  return p ? { kind: "cms" as const, p } : null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const found = await load(slug);
  if (!found) return { title: "Article not found" };
  return found.kind === "static"
    ? meta(found.a.title, found.a.metaDescription, "/blog/" + slug)
    : meta(
        found.p.seo_title || found.p.title,
        found.p.seo_description || found.p.excerpt,
        "/blog/" + slug,
      );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const found = await load(slug);
  if (!found) notFound();
  const title = found.kind === "static" ? found.a.title : found.p.title;
  const related =
    found.kind === "static"
      ? found.a.related.map(findService).filter((x) => x !== undefined)
      : [];
  return (
    <>
      <JsonLd
        data={graph(
          ...(found.kind === "static" ? [articleNode(found.a)] : []),
          breadcrumbNode([
            { name: "Guides", path: "/blog" },
            { name: title, path: "/blog/" + slug },
          ]),
        )}
      />
      <PageHero
        crumbs={[{ label: "Guides", href: "/blog" }, { label: title }]}
        title={title}
        description={found.kind === "static" ? found.a.dek : found.p.excerpt}
      />
      <article className="container article-body">
        {found.kind === "static" ? (
          found.a.sections.map(([h, b]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{b}</p>
            </section>
          ))
        ) : (
          <p className="pre-wrap">{found.p.body}</p>
        )}
        <div className="notice">
          General planning information. Electrical work should be evaluated and
          performed by a licensed electrician.
        </div>
        {related.length > 0 && (
          <>
            <h2 className="subhead">Related services</h2>
            <ul className="related">
              {related.map((s) => (
                <li key={s.slug}>
                  <Link href={"/services/" + s.slug}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="after-list">
          <Link className="text-link" href="/blog">
            All guides <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </p>
      </article>
      <ContactCTA />
    </>
  );
}
