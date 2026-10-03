import Link from "next/link";
import Image from "next/image";
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
      {(limit ? services.slice(0, limit) : services).map((s, i) => (
        <Link
          className="service-card"
          href={"/services/" + s.slug}
          key={s.slug}
        >
          <div className="service-card-top">
            <ServiceIcon name={s.icon} size={38} />
            <span>0{i + 1}</span>
          </div>
          <h3>{s.name}</h3>
          <p>{s.description}</p>
          <span className="text-link">
            Explore service <ArrowUpRight size={17} />
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
          <span className="eyebrow">A CLEAR FIRST STEP</span>
          <h2>Let’s find the problem.</h2>
          <p>
            Professional troubleshooting and evaluation of your electrical
            issue.
            <br />
            Understand what’s happening before deciding what comes next.
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
    <section className="section container about-grid">
      <figure className="about-photo">
        <Image
          src="/images/coastal-home.webp"
          alt="Illustration of a warmly lit California home with native landscaping"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <figcaption>
          Architecture illustration · not a completed project
        </figcaption>
        <span className="photo-label">ROOTED IN THE CENTRAL COAST</span>
      </figure>
      <div className="about-copy">
        <span className="eyebrow">YOUR LOCAL ELECTRICIAN</span>
        <h2>
          Good work.
          <br />
          Clear communication.
          <br />
          <em>Close to home.</em>
        </h2>
        <p>
          Pacific Plains Electric serves homes and businesses across San Luis
          Obispo County. From a troublesome outlet to a new installation, start
          with a conversation about what you need.
        </p>
        <div className="owner">
          <span className="owner-initials">NK</span>
          <span>
            <strong>Nicholas Kane</strong>
            <small>Owner · {business.license}</small>
          </span>
        </div>
        <Link href="/about" className="text-link">
          Get to know Pacific Plains <ArrowUpRight size={18} />
        </Link>
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
        <span className="eyebrow">LET’S TALK ABOUT YOUR PROJECT</span>
        <h2>What can we help you with?</h2>
        <p>
          A repair, a new installation, or a question. We’re here to help you
          take the next step.
        </p>
        <Actions />
      </div>
    </section>
  );
}
