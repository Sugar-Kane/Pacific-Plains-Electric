import type { Metadata } from "next";
import { business } from "@/config/business";
export function metadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [
        {
          url: "/images/central-coast.webp",
          width: 1984,
          height: 800,
          alt: "Central Coast landscape illustration",
        },
      ],
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
export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  name: business.name,
  url: business.siteUrl,
  telephone: business.workPhone.tel.slice(4),
  email: business.email,
  areaServed: { "@type": "AdministrativeArea", name: business.serviceArea },
};
