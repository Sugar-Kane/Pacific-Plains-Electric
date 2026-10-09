import Link from "next/link";
import Brand from "./brand";
import { Phone, MessageCircle } from "lucide-react";
import { business } from "@/config/business";
import { listedServices } from "@/config/content";
import { publishedAreas } from "@/config/areas";
export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <Brand />
            <p>{business.description}</p>
            <small>{business.license}</small>
          </div>
          <nav className="footer-col" aria-labelledby="footer-services">
            <h2 id="footer-services">Services</h2>
            <ul>
              {listedServices.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={"/services/" + s.slug}>{s.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/services">All services</Link>
              </li>
            </ul>
          </nav>
          <nav className="footer-col" aria-labelledby="footer-areas">
            <h2 id="footer-areas">Service areas</h2>
            <ul>
              {publishedAreas.map((a) => (
                <li key={a.slug}>
                  <Link href={"/service-areas/" + a.slug}>{a.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="footer-col" aria-labelledby="footer-company">
            <h2 id="footer-company">Company</h2>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/blog">Planning guides</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/request-service">Request service</Link>
              </li>
            </ul>
          </nav>
          <div className="footer-col">
            <h2>Get in touch</h2>
            <ul>
              <li>
                <a href={business.workPhone.tel}>{business.workPhone.display}</a>
                <small>Main line</small>
              </li>
              <li>
                <a href={business.directPhone.tel}>
                  {business.directPhone.display}
                </a>
                <small>Nicholas, direct</small>
              </li>
              <li>
                <a href={"mailto:" + business.email}>{business.email}</a>
              </li>
              <li>
                <small>{business.hours.display}</small>
              </li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <small>
            © {new Date().getFullYear()} {business.name}
          </small>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/admin">Owner sign in</Link>
          </nav>
        </div>
      </footer>
      <div className="mobile-action-bar" role="group" aria-label="Request service">
        <p className="request-options-label" aria-hidden="true">
          Request service
        </p>
        <a href={business.workPhone.tel}>
          <Phone size={17} aria-hidden="true" /> Call
        </a>
        <a href={business.workPhone.sms} aria-label="Text Pacific Plains Electric">
          <MessageCircle size={17} aria-hidden="true" /> Text
        </a>
        <Link href="/request-service">Online form</Link>
      </div>
    </>
  );
}
