import type { MetadataRoute } from "next";
import { business } from "@/config/business";
import { services, articles } from "@/config/content";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent("article");
  return [
    "",
    "/services",
    "/about",
    "/projects",
    "/blog",
    "/faq",
    "/contact",
    "/request-service",
    "/privacy",
    "/terms",
    ...services.map((s) => "/services/" + s.slug),
    ...articles.map((s) => "/blog/" + s.slug),
    ...content.map((s) => "/blog/" + s.slug),
  ].map((p) => ({ url: business.siteUrl + p }));
}
