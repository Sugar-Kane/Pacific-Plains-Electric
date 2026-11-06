import type { NextConfig } from "next";
// Google Analytics hosts are allowed only when a measurement ID is configured.
const ga = process.env.NEXT_PUBLIC_GA_ID
  ? {
      script: " https://*.googletagmanager.com",
      img: " https://*.google-analytics.com https://*.googletagmanager.com",
      connect:
        " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    }
  : { script: "", img: "", connect: "" };
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'" +
              (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "") +
              ga.script +
              "; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:" +
              ga.img +
              "; font-src 'self'; connect-src 'self' https://*.supabase.co" +
              ga.connect +
              "; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
          ...(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/appointment/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};
export default config;
