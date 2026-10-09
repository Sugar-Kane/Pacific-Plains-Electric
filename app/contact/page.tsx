import { Phone, Mail, Clock, MessageCircle, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import CaliforniaMap from "@/components/california-map";
import { PageHero } from "@/components/public";
import { business } from "@/config/business";
import { metadata as meta, JsonLd, graph, breadcrumbNode, webPageNode } from "@/lib/seo";
export const metadata = meta(
  "Contact",
  "Contact Pacific Plains Electric, a licensed electrician in San Luis Obispo County. Call or text (805) 626-7761, email, or send a service request online.",
  "/contact",
);
export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode("/contact", "Contact Pacific Plains Electric", { "@type": "ContactPage" }),
          breadcrumbNode([{ name: "Contact", path: "/contact" }]),
        )}
      />
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Call or text about a repair, talk through a project, or send the details online."
      />
      <section className="section container two-column">
        <div>
          <ul className="contact-list">
            <li className="contact-item">
              <Phone size={22} aria-hidden="true" />
              <div>
                <span className="contact-label">Main line</span>
                <a className="contact-value large" href={business.workPhone.tel}>
                  {business.workPhone.display}
                </a>
                <small>
                  Answered 24/7 by an automated assistant. Visits are by
                  appointment.
                </small>
              </div>
            </li>
            <li className="contact-item">
              <MessageCircle size={22} aria-hidden="true" />
              <div>
                <span className="contact-label">Text</span>
                <a className="contact-value" href={business.workPhone.sms}>
                  {business.workPhone.display}
                </a>
              </div>
            </li>
            <li className="contact-item">
              <Phone size={22} aria-hidden="true" />
              <div>
                <span className="contact-label">Nicholas Kane, direct</span>
                <a className="contact-value" href={business.directPhone.tel}>
                  {business.directPhone.display}
                </a>
              </div>
            </li>
            <li className="contact-item">
              <Mail size={22} aria-hidden="true" />
              <div>
                <span className="contact-label">Email</span>
                <a className="contact-value" href={"mailto:" + business.email}>
                  {business.email}
                </a>
              </div>
            </li>
            <li className="contact-item">
              <Clock size={22} aria-hidden="true" />
              <div>
                <span className="contact-label">Hours</span>
                <span className="contact-value">{business.hours.display}</span>
                <small>Appointment days are confirmed individually.</small>
              </div>
            </li>
          </ul>
          <Link className="button" href="/request-service">
            Request service <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="map-panel">
          <CaliforniaMap />
          <h2>San Luis Obispo County</h2>
          <p className="map-legend">
            <span /> Our service area
          </p>
          <p className="legal-note">We come to you. There’s no public storefront.</p>
          <a
            className="text-link"
            href="https://www.google.com/maps/search/San+Luis+Obispo+County+California"
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
