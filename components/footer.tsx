/* eslint-disable @next/next/no-html-link-for-pages -- Cross-language links need a full navigation to update the root document language. */
import { serviceNamesEs } from "@/lib/i18n/shared";
import Link from "next/link";
import Brand from "./brand";
import MobileActions from "./mobile-actions";
import { business } from "@/config/business";
import { listedServices } from "@/config/content";
import { publishedAreas } from "@/config/areas";
export default function Footer({ spanish = false }: { spanish?: boolean }) {
  const local = (url: string) => spanish ? "/es" + url : url;
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <Brand spanish={spanish} />
            <p>{spanish ? "Servicios eléctricos residenciales y comerciales en los condados de San Luis Obispo y Santa Barbara, California." : business.description}</p>
            <small>{business.license}</small>
          </div>
          <nav className="footer-col footer-desktop-links" aria-labelledby="footer-services">
            <h2 id="footer-services">{spanish ? "Servicios" : "Services"}</h2>
            <ul>
              {listedServices.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={local("/services/" + s.slug)}>{spanish ? serviceNamesEs[s.slug] : s.name}</Link>
                </li>
              ))}
              <li>
                <Link href={local("/services")}>{spanish ? "Todos los servicios" : "All services"}</Link>
              </li>
            </ul>
          </nav>
          <details className="footer-col footer-mobile-links">
            <summary>{spanish ? "Servicios" : "Services"}</summary>
            <nav aria-label={spanish ? "Servicios" : "Services"}>
            <ul>
              {listedServices.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={local("/services/" + s.slug)}>{spanish ? serviceNamesEs[s.slug] : s.name}</Link>
                </li>
              ))}
              <li>
                <Link href={local("/services")}>{spanish ? "Todos los servicios" : "All services"}</Link>
              </li>
            </ul>
            </nav>
          </details>
          <nav className="footer-col footer-desktop-links" aria-labelledby="footer-areas">
            <h2 id="footer-areas">{spanish ? "Áreas de servicio" : "Service areas"}</h2>
            <ul>
              {publishedAreas.map((a) => (
                <li key={a.slug}>
                  <Link href={local("/service-areas/" + a.slug)}>{a.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <details className="footer-col footer-mobile-links">
            <summary>{spanish ? "Áreas de servicio" : "Service areas"}</summary>
            <nav aria-label={spanish ? "Áreas de servicio" : "Service areas"}>
            <ul>
              {publishedAreas.map((a) => (
                <li key={a.slug}>
                  <Link href={local("/service-areas/" + a.slug)}>{a.name}</Link>
                </li>
              ))}
            </ul>
            </nav>
          </details>
          <nav className="footer-col" aria-labelledby="footer-company">
            <h2 id="footer-company">{spanish ? "Empresa" : "Company"}</h2>
            <ul>
              <li>
                <Link href={local("/about")}>{spanish ? "Nosotros" : "About"}</Link>
              </li>
              <li>
                <a href="/blog" lang={spanish ? "es" : "en"}>{spanish ? "Guías (en inglés)" : "Planning guides"}</a>
              </li>
              <li>
                <Link href={local("/faq")}>{spanish ? "Preguntas frecuentes" : "FAQ"}</Link>
              </li>
              <li>
                <Link href={local("/contact")}>{spanish ? "Contacto" : "Contact"}</Link>
              </li>
              <li>
                <Link href={local("/request-service")}>{spanish ? "Solicitar servicio" : "Request service"}</Link>
              </li>
            </ul>
          </nav>
          <div className="footer-col">
            <h2>{spanish ? "Contáctenos" : "Get in touch"}</h2>
            <ul>
              <li>
                <a href={business.workPhone.tel}>
                  {business.workPhone.display}
                </a>
                <small>{spanish ? "Línea principal" : "Main line"}</small>
              </li>
              <li>
                <a href={"mailto:" + business.email}>{business.email}</a>
              </li>
              <li>
                <small>{spanish ? "7:00 a. m. – 5:00 p. m., hora del Pacífico" : business.hours.display}</small>
              </li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <small>
            © {new Date().getFullYear()} {business.name}
          </small>
          <nav aria-label="Legal">
            <Link href={local("/privacy")}>{spanish ? "Privacidad" : "Privacy"}</Link>
            <Link href={local("/terms")}>{spanish ? "Términos" : "Terms"}</Link>
            <Link href={local("/accessibility")}>{spanish ? "Accesibilidad" : "Accessibility"}</Link>
            <a href="/admin" lang={spanish ? "es" : "en"}>{spanish ? "Acceso del propietario (en inglés)" : "Owner sign in"}</a>
          </nav>
        </div>
      </footer>
      <MobileActions spanish={spanish} />
    </>
  );
}
