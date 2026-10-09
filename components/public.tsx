import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  ReceiptText,
  Clock,
  Star,
} from "lucide-react";
import { business, diagnosticTerms } from "@/config/business";
import {
  listedServices,
  findService,
  process,
  answeredFaqs,
} from "@/config/content";
import { publishedAreas } from "@/config/areas";
import { reviews } from "@/config/reviews";
import { ServiceIcon } from "./icons";
export function Actions() {
  return (
    <div className="request-options" role="group" aria-label="Request service">
      <p className="request-options-label" aria-hidden="true">
        Request service
      </p>
      <div className="customer-actions">
        <a
          className="button outline"
          href={business.workPhone.tel}
          aria-label={"Call " + business.workPhone.display}
        >
          <Phone size={17} aria-hidden="true" /> Call
        </a>
        <a
          className="button outline"
          href={business.workPhone.sms}
          aria-label="Text Pacific Plains Electric"
        >
          <MessageCircle size={17} aria-hidden="true" /> Text
        </a>
        <Link className="button outline" href="/request-service">
          Online form
        </Link>
      </div>
    </div>
  );
}
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="page-hero">
      <div className="container">
        {crumbs ? (
          <Breadcrumb items={crumbs} />
        ) : (
          eyebrow && <span className="eyebrow">{eyebrow}</span>
        )}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((x) => (
        <span key={x.label}>
          <span aria-hidden="true">/ </span>
          {x.href ? (
            <Link href={x.href}>{x.label}</Link>
          ) : (
            <span aria-current="page">{x.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function SectionHead({
  eyebrow,
  title,
  link,
  id,
}: {
  eyebrow: string;
  title: string;
  link?: { label: string; href: string };
  id?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={id}>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" href={link.href}>
          {link.label} <ArrowRight size={17} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
/** Full catalogue: each card offers "Request service" and "Details". */
export function ServiceGrid() {
  return (
    <div className="service-grid">
      {listedServices.map((s) => (
        <article className="service-card" key={s.slug}>
          <span className="service-icon">
            <ServiceIcon name={s.icon} size={24} />
          </span>
          <h3>{s.name}</h3>
          <p>{s.summary}</p>
          <div className="service-card-actions">
            <Link
              className="text-link"
              href={"/request-service?service=" + s.requestAs}
              aria-label={"Request " + s.name}
            >
              Request service <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              className="service-details-link"
              href={"/services/" + s.slug}
              aria-label={"Details about " + s.name}
            >
              Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
/** Home page overview: whole card links to the service page. */
export function ServiceOverview({ slugs }: { slugs: string[] }) {
  return (
    <div className="service-grid">
      {slugs.map((slug) => {
        const s = findService(slug)!;
        return (
          <Link className="service-card" href={"/services/" + s.slug} key={slug}>
            <span className="service-icon">
              <ServiceIcon name={s.icon} size={24} />
            </span>
            <h3>{s.name}</h3>
            <p>{s.summary}</p>
            <span className="service-card-more">
              Learn more <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
export function Price() {
  return (
    <div className="price">
      <span className="price-amount">${business.diagnosticPrice}</span>
      <span className="price-unit">per visit</span>
    </div>
  );
}
export function Diagnostic() {
  return (
    <section className="section">
      <div className="container">
        <div className="diagnostic">
          <div>
            <span className="eyebrow">Diagnostic visits</span>
            <h2>Not sure what’s wrong? Start here.</h2>
            <p>
              We come out, trace the problem, and explain the repair options
              before any work begins.
            </p>
          </div>
          <div className="diagnostic-price">
            <Price />
            <p>{diagnosticTerms}</p>
          </div>
          <Link
            className="button on-brand"
            href="/request-service?service=troubleshooting"
          >
            Request a diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
}
export function PricingPanel({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="panel request-aside">
      <span className="eyebrow">Diagnostic visit</span>
      <Price />
      <p>
        On-site troubleshooting and a clear explanation of what we find.{" "}
        {diagnosticTerms}
      </p>
      {children}
      <hr />
      <a className="text-link" href={business.workPhone.tel}>
        <Phone size={17} aria-hidden="true" /> {business.workPhone.display}
      </a>
      <p className="legal-note">
        Main line, answered by an automated assistant 24/7. {business.license}.
      </p>
    </aside>
  );
}
export function OwnerSection({ aboutLink = true }: { aboutLink?: boolean }) {
  return (
    <section className="section container owner-section">
      <div>
        <span className="eyebrow">Owner and electrician</span>
        <h2>Nicholas Kane</h2>
        <p className="owner-role">California licensed · {business.license}</p>
      </div>
      <div>
        <p className="lede">
          Pacific Plains Electric is a locally owned contractor serving homes,
          businesses, and property managers across San Luis Obispo County.
          Questions about repairs, installations, and estimates go straight to
          Nicholas, the owner.
        </p>
        <div className="link-stack">
          <a className="text-link" href={business.directPhone.tel}>
            Call Nicholas: {business.directPhone.display}
          </a>
          {aboutLink && (
            <Link className="text-link" href="/about">
              About the business <ArrowRight size={17} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
export function Facts() {
  return (
    <ul className="facts">
      <li>
        <ShieldCheck size={24} aria-hidden="true" />
        <div>
          <strong>California licensed</strong>
          <span>{business.license}</span>
        </div>
      </li>
      <li>
        <ReceiptText size={24} aria-hidden="true" />
        <div>
          <strong>Upfront diagnostic price</strong>
          <span>${business.diagnosticPrice} per visit, repairs quoted separately</span>
        </div>
      </li>
      <li>
        <MapPin size={24} aria-hidden="true" />
        <div>
          <strong>Serving San Luis Obispo County</strong>
          <span>Homes and businesses across the county</span>
        </div>
      </li>
      <li>
        <Clock size={24} aria-hidden="true" />
        <div>
          <strong>Office hours</strong>
          <span>{business.hours.display}</span>
        </div>
      </li>
    </ul>
  );
}
export function FaqList({
  items = answeredFaqs,
  limit,
}: {
  items?: { q: string; a: string }[];
  limit?: number;
}) {
  return (
    <div className="faq-list">
      {(limit ? items.slice(0, limit) : items).map(({ q, a }) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function ContactCTA() {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>Have a job in mind?</h2>
        <p>Send the details or give us a call. We’ll follow up to set a time.</p>
        <Actions />
      </div>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <ol className="process">
      {process.map((p, i) => (
        <li key={p.title}>
          <span className="process-number">{i + 1}</span>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </li>
      ))}
    </ol>
  );
}
export function AreaLinks({ exclude }: { exclude?: string }) {
  return (
    <ul className="area-links">
      {publishedAreas
        .filter((a) => a.slug !== exclude)
        .map((a) => (
          <li key={a.slug}>
            <Link href={"/service-areas/" + a.slug}>
              <MapPin size={16} aria-hidden="true" /> {a.name}
            </Link>
          </li>
        ))}
    </ul>
  );
}
/** Renders only real reviews from config/reviews.ts, and only when there are some. */
export function Reviews() {
  if (!reviews.length && !business.googleReviewUrl) return null;
  return (
    <section className="section container" aria-labelledby="reviews-title">
      <SectionHead eyebrow="Reviews" title="What customers say" id="reviews-title" />
      {reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.quote} className="review-card">
              <blockquote>“{r.quote}”</blockquote>
              <p className="review-meta">
                {r.name}
                {r.area && ` · ${r.area}`}
                {r.url ? (
                  <>
                    {" · "}
                    <a href={r.url} rel="noopener noreferrer" target="_blank">
                      {r.source}
                    </a>
                  </>
                ) : (
                  ` · ${r.source}`
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
      {business.googleReviewUrl && (
        <a
          className="button outline"
          href={business.googleReviewUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Star size={17} aria-hidden="true" /> Leave a Google review
        </a>
      )}
    </section>
  );
}
