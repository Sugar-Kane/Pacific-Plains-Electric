import type { MetadataRoute } from "next";
import { business } from "@/config/business";
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.VERCEL_ENV === "preview"
        ? { userAgent: "*", disallow: "/" }
        : {
            userAgent: "*",
            allow: "/",
            // Private and non-content routes. Everything public stays crawlable,
            // including /llms.txt for AI search tools.
            disallow: ["/admin", "/api/", "/appointment/", "/auth/"],
          },
    sitemap: business.siteUrl + "/sitemap.xml",
    host: business.siteUrl,
  };
}
