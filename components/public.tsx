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
import { faqsEs, processEs } from "@/config/content-es";
import { diagnosticEs, serviceNamesEs, serviceSummariesEs } from "@/lib/i18n/shared";

/**
 * Shared page pieces for both languages. Every component takes `lang` and
 * renders the same structure in English or Spanish, so the two sites cannot
 * drift apart in layout or features; only the words differ.
 */
export type Lang = "en" | "es";
/** The same path in the given language: "/services" or "/es/services". */
export const href = (lang: Lang, path: string) => (lang === "es" ? (path === "/" ? "/es" : "/es" + path) : path);
const pick = (lang: Lang, en: string, es: string) => (lang === "es" ? es : en);
export const serviceName = (lang: Lang, slug: string, en: string) => (lang === "es" ? serviceNamesEs[slug] ?? en : en);
export const serviceSummary = (lang: Lang, slug: string, en: string) => (lang === "es" ? serviceSummariesEs[slug] ?? en : en);
export function Actions({ lang = "en" }: { lang?: Lang }) {
  return (
    <div
      className="actions primary-actions"
      role="group"
      aria-label={pick(lang, "Contact Pacific Plains Electric", "Contactar a Pacific Plains Electric")}
    >
      <Link className="button" href={href(lang, "/request-service")}>
        {pick(lang, "Request Service", "Solicitar servicio")} <ArrowRight size={17} aria-hidden="true" />
      </Link>
      <a className="button outline" href={business.workPhone.tel}>
        <Phone size={17} aria-hidden="true" /> <span className="contact-call-desktop">{pick(lang, "Call", "Llamar al")} {business.workPhone.display}</span><span className="contact-call-mobile">{pick(lang, "Call", "Llamar")}</span>
      </a>
      <a className="button outline" href={business.workPhone.sms}>
        <MessageSquare size={17} aria-hidden="true" /> {pick(lang, "Text Us", "Enviar mensaje")}
      </a>
    </div>
  );
}
const actionsEs: Record<string, string> = {
  "electrical-repair": "Obtener ayuda", "panel-upgrades": "Solicitar servicio", "ev-charger-installation": "Solicitar instalación",
  lighting: "Solicitar servicio", "new-construction": "Hablar de su proyecto", other: "Describir el problema",
};
export function ServiceChoices({ lang = "en" }: { lang?: Lang }) {
  const spanish = lang === "es";
  return (
    <ServiceMotionGroup spanish={spanish}><div className="service-grid service-choices">
      {intakeCategories.map((s) => (
        <Link
          className="service-card service-card-animated"
          href={href(lang, "/request-service") + "?service=" + s.slug}
          key={s.slug}
        >
          <ServiceAnimation service={s.slug} spanish={spanish} />
          <div className="service-card-copy">
          <h3>{serviceName(lang, s.slug, s.name)}</h3>
          <p>{serviceSummary(lang, s.slug, s.summary)}</p>
          <span className="service-card-more">
            {spanish ? actionsEs[s.slug] : s.action} <ArrowRight size={17} aria-hidden="true" />
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
  lang = "en",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  crumbs?: { label: string; href?: string }[];
  lang?: Lang;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        {crumbs ? (
          <Breadcrumb items={crumbs} lang={lang} />
        ) : (
          eyebrow && <span className="eyebrow">{eyebrow}</span>
        )}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
function Breadcrumb({ items, lang }: { items: { label: string; href?: string }[]; lang: Lang }) {
  return (
    <nav className="breadcrumbs" aria-label={pick(lang, "Breadcrumb", "Ruta de navegación")}>
      <Link href={href(lang, "/")}>{pick(lang, "Home", "Inicio")}</Link>
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
export function ServiceGrid({ lang = "en" }: { lang?: Lang }) {
  return (
    <div className="service-grid">
      {listedServices.map((s) => {
        const name = serviceName(lang, s.slug, s.name);
        return (
        <article className="service-card" key={s.slug}>
          <span className="service-icon">
            <ServiceIcon name={s.icon} size={24} />
          </span>
          <h3>{name}</h3>
          <p>{serviceSummary(lang, s.slug, s.summary)}</p>
          <div className="service-card-actions">
            <Link
              className="text-link"
              href={href(lang, "/request-service") + "?service=" + s.requestAs}
              aria-label={pick(lang, "Request " + name, "Solicitar " + name)}
            >
              {pick(lang, "Request service", "Solicitar servicio")} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              className="service-details-link"
              href={href(lang, "/services/" + s.slug)}
              aria-label={pick(lang, "Details about " + name, "Detalles de " + name)}
            >
              {pick(lang, "Details", "Detalles")}
            </Link>
          </div>
        </article>
        );
      })}
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
export function Price({ lang = "en" }: { lang?: Lang }) {
  return (
    <div className="price">
      <span className="price-amount">${business.diagnosticPrice}</span>
      <span className="price-unit">{pick(lang, "per visit", "por visita")}</span>
    </div>
  );
}
export function Diagnostic({ lang = "en" }: { lang?: Lang }) {
  const es = lang === "es";
  return (
    <section className="section" aria-labelledby="diagnostic-title">
      <div className="container">
        <div className="diagnostic">
          <div>
            <span className="eyebrow">{pick(lang, "Electrical Diagnostic Visit: $180", "Visita de diagnóstico eléctrico: $180")}</span>
            <h2 id="diagnostic-title">
              {pick(lang, "Your $180 diagnostic fee goes toward your repair.", "Los $180 del diagnóstico se aplican a su reparación.")}
            </h2>
            <p>
              {pick(lang,
                "Not sure what’s causing your electrical problem? We’ll inspect the issue, identify the likely cause, and explain your repair options.",
                "¿No sabe qué causa el problema eléctrico? Revisaremos el problema, identificaremos la causa probable y le explicaremos sus opciones de reparación.")}
            </p>
            <p className="diagnostic-policy">{es ? diagnosticEs : diagnosticTerms}</p>
            <Link
              className="button on-brand"
              href={href(lang, "/request-service") + "?service=troubleshooting"}
            >
              {pick(lang, "Request a Diagnostic", "Solicitar un diagnóstico")}
            </Link>
          </div>
          <div className="credit-example">
            <h3>{pick(lang, "A simple example", "Un ejemplo sencillo")}</h3>
            <dl>
              <div>
                <dt>{pick(lang, "Diagnostic visit paid", "Diagnóstico pagado")}</dt>
                <dd>$180</dd>
              </div>
              <div>
                <dt>{pick(lang, "Follow-up repair quote", "Presupuesto de la reparación posterior")}</dt>
                <dd>$500</dd>
              </div>
              <div>
                <dt>{pick(lang, "Diagnostic payment credited", "Crédito por el diagnóstico")}</dt>
                <dd>−$180</dd>
              </div>
              <div className="credit-balance">
                <dt>{pick(lang, "Remaining repair balance", "Saldo restante de la reparación")}</dt>
                <dd>$320</dd>
              </div>
            </dl>
            <p>
              {pick(lang,
                "Example only, not a repair estimate. You pay $180 for the diagnostic visit, then $320 for the approved repair in this example: $500 total. The credit applies your prior payment once.",
                "Solo es un ejemplo, no un presupuesto. En este ejemplo paga $180 por el diagnóstico y después $320 por la reparación aprobada: $500 en total. El crédito aplica su pago anterior una sola vez.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function PricingPanel({ children, lang = "en" }: { children?: React.ReactNode; lang?: Lang }) {
  return (
    <aside className="panel request-aside">
      <span className="eyebrow">{pick(lang, "Diagnostic visit", "Visita de diagnóstico")}</span>
      <Price lang={lang} />
      <p>
        {pick(lang, "On-site troubleshooting and a clear explanation of what we find.", "Revisión en el lugar y una explicación clara de lo que encontremos.")}{" "}
        {lang === "es" ? diagnosticEs : diagnosticTerms}
      </p>
      {children}
      <hr />
      <a className="text-link" href={business.workPhone.tel}>
        <Phone size={17} aria-hidden="true" /> {business.workPhone.display}
      </a>
      <p className="legal-note">
        {pick(lang, "Main line, answered by an automated assistant 24/7.", "Línea principal, atendida por un asistente automatizado las 24 horas.")} {business.license}.
      </p>
    </aside>
  );
}
export function OwnerSection({ aboutLink = true, lang = "en" }: { aboutLink?: boolean; lang?: Lang }) {
  return (
    <section className="section container owner-section">
      <div>
        <span className="eyebrow">{pick(lang, "Meet your electrician", "Conozca a su electricista")}</span>
        <h2>Nicholas Kane</h2>
        <p className="owner-role">
          {pick(lang, "Owner, Pacific Plains Electric", "Propietario de Pacific Plains Electric")} · {business.license}
        </p>
        <a
          className="text-link"
          href={business.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {pick(lang, "Verify license #1162180 with CSLB", "Verificar la licencia #1162180 con CSLB (en inglés)")}
        </a>
      </div>
      <div>
        <p className="lede">
          {pick(lang,
            "Pacific Plains Electric is a locally owned contractor serving homes, businesses, and property managers across San Luis Obispo and Santa Barbara counties. Questions about repairs, installations, and estimates go straight to Nicholas, the owner.",
            "Pacific Plains Electric es un contratista local que atiende hogares, negocios y administradores de propiedades en los condados de San Luis Obispo y Santa Barbara. Las preguntas sobre reparaciones, instalaciones y presupuestos llegan directamente a Nicholas, el propietario.")}
        </p>
        <div className="link-stack">
          <a className="text-link" href={"mailto:" + business.email}>
            {pick(lang, "Email Nicholas", "Escribir a Nicholas")}: {business.email}
          </a>
          {aboutLink && (
            <Link className="text-link" href={href(lang, "/about")}>
              {pick(lang, "About the business", "Sobre la empresa")} <ArrowRight size={17} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
export function Facts({ lang = "en" }: { lang?: Lang }) {
  return (
    <ul className="facts">
      <li>
        <ShieldCheck size={24} aria-hidden="true" />
        <div>
          <strong>{pick(lang, "California licensed", "Licencia de California")}</strong>
          <span>{business.license}</span>
        </div>
      </li>
      <li>
        <ReceiptText size={24} aria-hidden="true" />
        <div>
          <strong>{pick(lang, "Upfront diagnostic price", "Precio de diagnóstico por adelantado")}</strong>
          <span>
            {lang === "es"
              ? `$${business.diagnosticPrice}, acreditados a reparaciones posteriores aprobadas que cumplan los requisitos`
              : `$${business.diagnosticPrice}, credited toward qualifying approved follow-up repairs`}
          </span>
        </div>
      </li>
      <li>
        <MapPin size={24} aria-hidden="true" />
        <div>
          <strong>{pick(lang, "Serving San Luis Obispo and Santa Barbara counties", "Al servicio de los condados de San Luis Obispo y Santa Barbara")}</strong>
          <span>{pick(lang, "Homes and businesses across both counties", "Hogares y negocios en ambos condados")}</span>
        </div>
      </li>
      <li>
        <Clock size={24} aria-hidden="true" />
        <div>
          <strong>{pick(lang, "Office hours", "Horario de oficina")}</strong>
          <span>{lang === "es" ? "7:00 a. m. a 5:00 p. m., hora del Pacífico" : business.hours.display}</span>
        </div>
      </li>
    </ul>
  );
}
export function FaqList({
  items,
  limit,
  lang = "en",
}: {
  items?: { q: string; a: string }[];
  limit?: number;
  lang?: Lang;
}) {
  const list = items ?? (lang === "es" ? faqsEs : answeredFaqs);
  return (
    <div className="faq-list">
      {(limit ? list.slice(0, limit) : list).map(({ q, a }) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function ContactCTA({ lang = "en" }: { lang?: Lang }) {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>{pick(lang, "Have a job in mind?", "¿Tiene un trabajo en mente?")}</h2>
        <p>
          {pick(lang, "Send the details or give us a call. We’ll follow up to set a time.", "Envíenos los detalles o llámenos. Nos comunicaremos con usted para acordar un horario.")}
        </p>
        <Actions lang={lang} />
      </div>
    </section>
  );
}

export function ProcessSteps({ lang = "en" }: { lang?: Lang }) {
  return (
    <ol className="process">
      {(lang === "es" ? processEs : process).map((p, i) => (
        <li key={p.title}>
          <span className="process-number">{i + 1}</span>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </li>
      ))}
    </ol>
  );
}
export function AreaLinks({ exclude, lang = "en" }: { exclude?: string; lang?: Lang }) {
  return (
    <ul className="area-links">
      {publishedAreas
        .filter((a) => a.slug !== exclude)
        .map((a) => (
          <li key={a.slug}>
            <Link href={href(lang, "/service-areas/" + a.slug)}>
              <MapPin size={16} aria-hidden="true" /> {a.name}
            </Link>
          </li>
        ))}
    </ul>
  );
}
/** Renders only real reviews from config/reviews.ts, and only when there are some. */
export function Reviews({ lang = "en" }: { lang?: Lang }) {
  if (!reviews.length && !business.googleReviewUrl) return null;
  return (
    <section className="section container" aria-labelledby="reviews-title">
      <SectionHead
        eyebrow={pick(lang, "Reviews", "Reseñas")}
        title={pick(lang, "What customers say", "Lo que dicen nuestros clientes")}
        id="reviews-title"
      />
      {reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.quote} className="review-card">
              {/* Reviews are shown word for word, in the language they were written in. */}
              <blockquote lang={lang === "es" ? "en" : undefined}>“{r.quote}”</blockquote>
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
          <Star size={17} aria-hidden="true" /> {pick(lang, "Leave a Google review", "Dejar una reseña en Google")}
        </a>
      )}
    </section>
  );
}
