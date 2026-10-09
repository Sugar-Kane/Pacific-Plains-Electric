import type { Metadata } from "next";
import { business } from "@/config/business";
import { publishedAreas, countyOf } from "@/config/areas";
import { listedServices, type Article, type Service } from "@/config/content";

const SITE = business.siteUrl;
export const BUSINESS_ID = `${SITE}/#business`;
export const WEBSITE_ID = `${SITE}/#website`;
const COUNTY_WIKI = "https://en.wikipedia.org/wiki/San_Luis_Obispo_County,_California";

/**
 * Page metadata with a canonical URL and matching Open Graph and Twitter tags.
 * `absolute` skips the "| Pacific Plains Electric" template for titles that
 * already carry the brand or are better without it.
 */
export function metadata(
  title: string,
  description: string,
  path: string,
  { absolute = false, noindex = false }: { absolute?: boolean; noindex?: boolean } = {},
): Metadata {
  const fullTitle = absolute ? title : `${title} | ${business.name}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: business.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: business.ogImage,
          width: 1200,
          height: 630,
          alt: `${business.name}, electrician serving ${business.county}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [business.ogImage],
    },
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const graph = (...nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

const ref = (id: string) => ({ "@id": id });

const countyNode = {
  "@type": "AdministrativeArea",
  name: business.county,
  sameAs: COUNTY_WIKI,
};

/** The business entity. Every other node points here by @id. */
export function businessNode() {
  const hours = business.hours.days;
  return {
    "@type": "Electrician",
    "@id": BUSINESS_ID,
    name: business.name,
    description: business.description,
    url: SITE,
    logo: { "@type": "ImageObject", url: SITE + business.logoPng, width: 512, height: 512 },
    image: SITE + business.ogImage,
    telephone: business.workPhone.e164,
    email: business.email,
    // A service-area business: no street address is published.
    address: { "@type": "PostalAddress", addressRegion: "CA", addressCountry: "US" },
    areaServed: [
      countyNode,
      ...publishedAreas.map((a) => ({
        "@type": a.kind === "city" ? "City" : "Place",
        name: `${a.name}, CA`,
        sameAs: a.wikipedia,
        containedInPlace: { "@type": "AdministrativeArea", name: countyOf(a) },
      })),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.workPhone.e164,
      email: business.email,
      contactType: "customer service",
      areaServed: "US-CA",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "California contractor license",
      identifier: business.licenseNumber,
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "Contractors State License Board",
        url: "https://www.cslb.ca.gov",
      },
    },
    ...(hours && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.map((d) => `https://schema.org/${d}`),
        opens: business.hours.start,
        closes: business.hours.end,
      },
    }),
    ...(business.paymentMethods && { paymentAccepted: business.paymentMethods.join(", ") }),
    ...(business.sameAs.length > 0 && { sameAs: business.sameAs }),
    knowsAbout: listedServices.map((s) => s.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electrical services",
      itemListElement: listedServices.map((s) => ({
        "@type": "Offer",
        itemOffered: ref(`${SITE}/services/${s.slug}#service`),
      })),
    },
  };
}

export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE,
  name: business.name,
  inLanguage: "en-US",
  publisher: ref(BUSINESS_ID),
});

export function serviceNode(s: Service) {
  return {
    "@type": "Service",
    "@id": `${SITE}/services/${s.slug}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.description,
    url: `${SITE}/services/${s.slug}`,
    provider: ref(BUSINESS_ID),
    areaServed: countyNode,
    audience: { "@type": "Audience", audienceType: s.audience },
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...items].map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.name,
      item: SITE + x.path,
    })),
  };
}

export function faqNode(list: { q: string; a: string }[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${SITE}${path}#faq`,
    mainEntity: list.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleNode(a: Pick<Article, "slug" | "title" | "dek" | "published">) {
  return {
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    datePublished: a.published,
    author: ref(BUSINESS_ID),
    publisher: ref(BUSINESS_ID),
    mainEntityOfPage: `${SITE}/blog/${a.slug}`,
    image: SITE + business.ogImage,
  };
}

export function webPageNode(path: string, name: string, extra: object = {}) {
  return {
    "@type": "WebPage",
    "@id": `${SITE}${path}#webpage`,
    url: SITE + path,
    name,
    isPartOf: ref(WEBSITE_ID),
    about: ref(BUSINESS_ID),
    ...extra,
  };
}
