import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/config/content";
import { business } from "@/config/business";
import { Breadcrumb, PageHero, ContactCTA } from "@/components/public";
import { metadata as meta, JsonLd } from "@/lib/seo";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  const p = a
    ? null
    : (await getContent("article")).find((a) => a.slug === slug);
  return a
    ? meta(a.title, a.dek, "/blog/" + slug)
    : p
      ? meta(
          p.seo_title || p.title,
          p.seo_description || p.excerpt,
          "/blog/" + slug,
        )
      : { title: "Article not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  const p = a
    ? null
    : (await getContent("article")).find((a) => a.slug === slug);
  if (!a && !p) notFound();
  const title = a?.title || p!.title;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          author: { "@type": "Organization", name: business.name },
          publisher: { "@type": "Organization", name: business.name },
          mainEntityOfPage: business.siteUrl + "/blog/" + slug,
        }}
      />
      <PageHero
        eyebrow={a?.category || p!.category}
        title={title}
        description={a?.dek || p!.excerpt}
      />
      <Breadcrumb
        items={[{ label: "Blog", href: "/blog" }, { label: title }]}
      />
      <article className="container article-body">
        {a ? (
          a.sections.map(([h, b]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{b}</p>
            </section>
          ))
        ) : (
          <p style={{ whiteSpace: "pre-wrap" }}>{p!.body}</p>
        )}
        <div className="notice">
          General planning information. Electrical work should be evaluated and
          performed by qualified professionals.
        </div>
        <Link className="text-link" href="/services">
          Explore our electrical services ↗
        </Link>
      </article>
      <ContactCTA />
    </>
  );
}
