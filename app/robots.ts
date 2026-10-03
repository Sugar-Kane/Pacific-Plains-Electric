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
            disallow: ["/admin", "/api/", "/appointment/", "/auth/"],
          },
    sitemap: business.siteUrl + "/sitemap.xml",
  };
}
