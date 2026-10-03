import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { business } from "@/config/business";
import { faqs } from "@/config/content";
import {
  Actions,
  ServiceGrid,
  Diagnostic,
  ContactCTA,
} from "@/components/public";
import { metadata as meta, JsonLd, businessSchema } from "@/lib/seo";
export const metadata = meta(
  "Central Coast Electrician",
  "Electrical repairs and installations in San Luis Obispo County. $180 diagnostic visits. CSLB #1162180.",
  "/",
);
export default function Home() {
  return (
    <>
      <JsonLd data={businessSchema} />
      <section className="hero">
        <Image
          src="/images/central-coast.webp"
          alt="Illustrated Central Coast landscape"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-wash" />
        <div className="container hero-content">
          <span className="eyebrow">SAN LUIS OBISPO COUNTY</span>
          <h1>
            Your local electrician.<br />A simpler way to get it done.
          </h1>
          <p>
            Repairs, upgrades, and installations for your home or business. Tell
            us what needs doing.
          </p>
          <Actions />
          <p className="hero-note">Nicholas Kane · {business.license}</p>
        </div>
      </section>
      <section className="section container" id="services">
        <div className="section-heading">
          <h2>What we do</h2>
          <p>For your home. For your business.</p>
        </div>
        <ServiceGrid />
      </section>
      <Diagnostic />
      <section className="section container owner-section">
        <div>
          <span className="eyebrow">OWNER / ELECTRICIAN</span>
          <h2>Nicholas Kane</h2>
        </div>
        <div>
          <p>
            Pacific Plains Electric serves homes, businesses, and property
            managers across San Luis Obispo County. Have a question about a job?
            You can reach Nicholas directly.
          </p>
          <a className="text-link" href={business.directPhone.tel}>
            Call Nicholas: {business.directPhone.display}{" "}
            <ArrowUpRight size={18} />
          </a>
          <Link href="/about" className="text-link">
            About the business <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section container faq-grid">
        <div>
          <h2>Before you call</h2>
          <Link href="/faq" className="text-link">
            More questions <ArrowUpRight size={18} />
          </Link>
        </div>
        <div>
          {faqs.slice(0, 3).map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
