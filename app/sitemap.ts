import type { MetadataRoute } from "next";
import { business } from "@/config/business";
import { services, articles } from "@/config/content";
import { publishedAreas } from "@/config/areas";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getContent("article"), getContent("project")]);
  const entries: [string, number][] = [
    ["", 1],
    ["/services", 0.9],
    ["/service-areas", 0.9],
    ["/request-service", 0.8],
    ["/contact", 0.8],
    ["/about", 0.7],
    ["/faq", 0.7],
    ["/blog", 0.6],
    ...services.map((s): [string, number] => ["/services/" + s.slug, 0.8]),
    ...publishedAreas.map((a): [string, number] => ["/service-areas/" + a.slug, 0.8]),
    ...articles.map((a): [string, number] => ["/blog/" + a.slug, 0.5]),
    ...posts.map((p): [string, number] => ["/blog/" + p.slug, 0.5]),
    // Projects is noindexed until it has real content.
    ...(projects.length ? [["/projects", 0.5] as [string, number]] : []),
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ];
  return entries.map(([path, priority]) => ({ url: business.siteUrl + path, priority }));
}
