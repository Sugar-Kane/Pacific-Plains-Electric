import ServiceAnimation from "./service-animation";
import ServiceMotionGroup from "./service-motion-group";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  ShieldCheck,
  MapPin,
  ReceiptText,
  Clock,
  Star,
} from "lucide-react";
import { intakeCategories } from "@/config/intake";
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
    <div
      className="actions primary-actions"
      role="group"
      aria-label="Contact Pacific Plains Electric"
    >
      <Link className="button" href="/request-service">
        Request Service <ArrowRight size={17} aria-hidden="true" />
      </Link>
      <a className="button outline" href={business.workPhone.tel}>
        <Phone size={17} aria-hidden="true" /> <span className="contact-call-desktop">Call {business.workPhone.display}</span><span className="contact-call-mobile">Call</span>
      </a>
      <a className="button outline" href={business.workPhone.sms}>
        <MessageSquare size={17} aria-hidden="true" /> Text Us
      </a>
    </div>
  );
}
export function ServiceChoices() {
  return (
    <ServiceMotionGroup><div className="service-grid service-choices">
      {intakeCategories.map((s) => (
        <Link
          className="service-card service-card-animated"
          href={"/request-service?service=" + s.slug}
          key={s.slug}
        >
          <ServiceAnimation service={s.slug} />
          <div className="service-card-copy">
          <h3>{s.name}</h3>
          <p>{s.summary}</p>
          <span className="service-card-more">
            {s.action} <ArrowRight size={17} aria-hidden="true" />
          </span>
          </div>
        </Link>
      ))}
    </div></ServiceMotionGroup>
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
          <Link
            className="service-card"
            href={"/services/" + s.slug}
            key={slug}
          >
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
    <section className="section" aria-labelledby="diagnostic-title">
      <div className="container">
        <div className="diagnostic">
          <div>
            <span className="eyebrow">Electrical Diagnostic Visit: $180</span>
            <h2 id="diagnostic-title">
              Your $180 diagnostic fee goes toward your repair.
            </h2>
            <p>
              Not sure what’s causing your electrical problem? We’ll inspect the
              issue, identify the likely cause, and explain your repair options.
            </p>
            <p className="diagnostic-policy">{diagnosticTerms}</p>
            <Link
              className="button on-brand"
              href="/request-service?service=troubleshooting"
            >
              Request a Diagnostic
            </Link>
          </div>
          <div className="credit-example">
            <h3>A simple example</h3>
            <dl>
              <div>
                <dt>Diagnostic visit paid</dt>
                <dd>$180</dd>
              </div>
              <div>
                <dt>Follow-up repair quote</dt>
                <dd>$500</dd>
              </div>
              <div>
                <dt>Diagnostic payment credited</dt>
                <dd>−$180</dd>
              </div>
              <div className="credit-balance">
                <dt>Remaining repair balance</dt>
                <dd>$320</dd>
              </div>
            </dl>
            <p>
              Example only, not a repair estimate. You pay $180 for the
              diagnostic visit, then $320 for the approved repair in this
              example: $500 total. The credit applies your prior payment once.
            </p>
          </div>
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
        <span className="eyebrow">Meet your electrician</span>
        <h2>Nicholas Kane</h2>
        <p className="owner-role">
          Owner, Pacific Plains Electric · {business.license}
        </p>
        <a
          className="text-link"
          href={business.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify license #1162180 with CSLB
        </a>
      </div>
      <div>
        <p className="lede">
          Pacific Plains Electric is a locally owned contractor serving homes,
          businesses, and property managers across San Luis Obispo and Santa
          Barbara counties. Questions about repairs, installations, and
          estimates go straight to Nicholas, the owner.
        </p>
        <div className="link-stack">
          <a className="text-link" href={"mailto:" + business.email}>
            Email Nicholas: {business.email}
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
          <span>
            ${business.diagnosticPrice}, credited toward qualifying approved
            follow-up repairs
          </span>
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
        <p>
          Send the details or give us a call. We’ll follow up to set a time.
        </p>
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
      <SectionHead
        eyebrow="Reviews"
        title="What customers say"
        id="reviews-title"
      />
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
