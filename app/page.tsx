import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, MapPin } from "lucide-react";
import { business } from "@/config/business";
import { services, articles, faqs } from "@/config/content";
import { ServiceIcon } from "@/components/icons";
import {
  Actions,
  ServiceGrid,
  Diagnostic,
  AboutSection,
  TrustStrip,
  ContactCTA,
} from "@/components/public";
import { metadata as meta, JsonLd, businessSchema } from "@/lib/seo";
export const metadata = meta(
  "Central Coast Electrician",
  "Electrical services for homes and businesses in San Luis Obispo County. $180 diagnostic service. CSLB #1162180.",
  "/",
);
export default function Home() {
  return (
    <>
      <JsonLd data={businessSchema} />
      <section className="hero">
        <Image
          src="/images/central-coast.webp"
          alt="Illustration of golden hills and the Pacific coastline"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-wash" />
        <div className="container hero-content">
          <span className="eyebrow">
            LOCAL PEOPLE. DEPENDABLE ELECTRICAL WORK.
          </span>
          <h1>
            Trusted electrical
            <br />
            services for the
            <br />
            <em>Central Coast.</em>
          </h1>
          <p>
            Professional electrical services for homes and businesses throughout
            San Luis Obispo County.
          </p>
          <Actions />
          <div className="hero-note">
            <span className="status-dot" />
            24/7 AI phone assistant <span>·</span> Diagnostic service{" "}
            <strong>${business.diagnosticPrice}</strong>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>
            <MapPin size={15} /> San Luis Obispo County, California
          </span>
          <a href="#services">
            A little closer to home <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <div className="shortcuts container">
        {services.slice(0, 6).map((s) => (
          <Link key={s.slug} href={"/services/" + s.slug}>
            <ServiceIcon name={s.icon} />
            <span>{s.name}</span>
          </Link>
        ))}
      </div>
      <section className="section container" id="services">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BUILT AROUND WHAT YOU NEED</span>
            <h2>
              Small repairs. Big plans.
              <br />
              The right help for both.
            </h2>
          </div>
          <div>
            <p>
              Practical electrical solutions for the place
              <br />
              you call home—and the place you work.
            </p>
            <Link className="text-link" href="/services">
              View all services <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <ServiceGrid limit={6} />
      </section>
      <Diagnostic />
      <AboutSection />
      <TrustStrip />
      <section className="section muted-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SIMPLE FROM THE START</span>
              <h2>Getting help is easy.</h2>
            </div>
            <Link className="text-link" href="/request-service">
              Tell us what you need <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="steps-grid">
            {[
              [
                "01",
                "Tell us what’s going on",
                "Send a service request or call our work number. No account needed.",
              ],
              [
                "02",
                "We coordinate a time",
                "We’ll review your request and help arrange your appointment.",
              ],
              [
                "03",
                "Know your next step",
                "Get an evaluation and discuss the work before moving forward.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FROM THE BLOG</span>
            <h2>A little electrical know-how.</h2>
          </div>
          <Link className="text-link" href="/blog">
            Read the journal <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="article-grid">
          {articles.map((a, i) => (
            <Link
              className="article-card"
              href={"/blog/" + a.slug}
              key={a.slug}
            >
              <div className={"article-art art-" + i}>
                <ServiceIcon
                  name={
                    i === 0 ? "CarFront" : i === 1 ? "PanelsTopLeft" : "Lamp"
                  }
                  size={72}
                />
                <span>PACIFIC PLAINS FIELD NOTES</span>
              </div>
              <small>{a.category}</small>
              <h3>{a.title}</h3>
              <p>{a.dek}</p>
              <span className="text-link">
                Read article <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container faq-grid">
        <div>
          <span className="eyebrow">GOOD QUESTIONS</span>
          <h2>
            A few things
            <br />
            you may be wondering.
          </h2>
          <Link href="/faq" className="text-link">
            All common questions <ArrowUpRight size={18} />
          </Link>
        </div>
        <div>
          {faqs.slice(0, 4).map(([q, a]) => (
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
