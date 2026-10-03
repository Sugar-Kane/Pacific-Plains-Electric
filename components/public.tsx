import Link from "next/link";
import { ArrowUpRight, Phone, ShieldCheck, MapPin, Check } from "lucide-react";
import { business } from "@/config/business";
import { services } from "@/config/content";
import { ServiceIcon } from "./icons";
export function Actions() {
  return (
    <div className="actions">
      <Link className="button" href="/request-service">
        Request Service <ArrowUpRight size={18} />
      </Link>
      <a className="button outline" href={business.workPhone.tel}>
        <Phone size={18} />
        {business.workPhone.display}
      </a>
    </div>
  );
}
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((x, i) => (
        <span key={i}>
          {" "}
          / {x.href ? <Link href={x.href}>{x.label}</Link> : x.label}
        </span>
      ))}
    </nav>
  );
}
export function ServiceGrid({ limit }: { limit?: number }) {
  return (
    <div className="service-grid">
      {(limit ? services.slice(0, limit) : services).map((s) => (
        <Link
          className="service-card"
          href={"/services/" + s.slug}
          key={s.slug}
        >
          <div className="service-card-top">
            <ServiceIcon name={s.icon} size={38} />
          </div>
          <h3>{s.name}</h3>
          <p>{s.description}</p>
          <span className="text-link">
            Service details <ArrowUpRight size={17} />
          </span>
        </Link>
      ))}
    </div>
  );
}
export function Diagnostic() {
  return (
    <section className="diagnostic">
      <div className="container diagnostic-inner">
        <div>
          <span className="eyebrow">DIAGNOSTIC VISITS</span>
          <h2>Find out what’s wrong.</h2>
          <p>
            An on-site visit to trace the issue and explain the repair options.
          </p>
        </div>
        <div className="diagnostic-price">
          <span>Electrical diagnostic</span>
          <strong>
            ${business.diagnosticPrice}
            <small> / visit</small>
          </strong>
          <small>
            Repairs and project work quoted separately.
            <br />
            The fee is not automatically credited toward repairs.
          </small>
        </div>
        <Link
          className="button gold"
          href="/request-service?service=troubleshooting"
        >
          Request Diagnostic <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function AboutSection() {
  return (
    <section className="section container owner-section">
      <div>
        <span className="eyebrow">OWNER / ELECTRICIAN</span>
        <h2>Nicholas Kane</h2>
        <p>{business.license}</p>
      </div>
      <div>
        <p>
          Pacific Plains Electric is a locally owned electrical business serving
          San Luis Obispo County. Nicholas handles inquiries about repairs,
          installations, and project estimates.
        </p>
        <a className="text-link" href={business.directPhone.tel}>
          Call Nicholas: {business.directPhone.display}{" "}
          <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
export function TrustStrip() {
  return (
    <div className="trust-strip container">
      <div>
        <ShieldCheck />
        <span>
          <strong>California licensed</strong>
          <small>{business.license}</small>
        </span>
      </div>
      <div>
        <Check />
        <span>
          <strong>Clear diagnostic pricing</strong>
          <small>${business.diagnosticPrice} · repairs quoted separately</small>
        </span>
      </div>
      <div>
        <MapPin />
        <span>
          <strong>Local service</strong>
          <small>San Luis Obispo County</small>
        </span>
      </div>
    </div>
  );
}
export function ContactCTA() {
  return (
    <section className="contact-cta">
      <div className="container">
        <h2>Need an electrician?</h2>
        <p>
          Send the job details or give us a call. We’ll confirm a time with you.
        </p>
        <Actions />
      </div>
    </section>
  );
}
