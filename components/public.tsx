import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  ReceiptText,
} from "lucide-react";
import { business, diagnosticTerms } from "@/config/business";
import { services, faqs } from "@/config/content";
import { ServiceIcon } from "./icons";
export function Actions() {
  return (
    <div className="actions customer-actions">
      <Link className="button request-action" href="/request-service">
        Request service <ArrowRight size={18} aria-hidden="true" />
      </Link>
      <a
        className="button outline call-action"
        href={business.workPhone.tel}
        aria-label={"Call " + business.workPhone.display}
      >
        <Phone size={17} aria-hidden="true" />
        <span className="call-number">{business.workPhone.display}</span>
        <span className="call-label">Call</span>
      </a>
      <a
        className="button outline text-action"
        href={business.workPhone.sms}
        aria-label="Text Pacific Plains Electric"
      >
        <MessageCircle size={17} aria-hidden="true" /> Text
      </a>
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
}: {
  eyebrow: string;
  title: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
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
      {services.map((s) => (
        <article className="service-card" key={s.slug}>
          <span className="service-icon">
            <ServiceIcon name={s.icon} size={24} />
          </span>
          <h3>{s.name}</h3>
          <p>{s.summary}</p>
          <div className="service-card-actions">
            <Link
              className="text-link"
              href={"/request-service?service=" + s.slug}
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
        const s = services.find((x) => x.slug === slug)!;
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
          <strong>Local to the Central Coast</strong>
          <span>San Luis Obispo County</span>
        </div>
      </li>
    </ul>
  );
}
export function FaqList({ limit }: { limit?: number }) {
  return (
    <div className="faq-list">
      {(limit ? faqs.slice(0, limit) : faqs).map(([q, a]) => (
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
