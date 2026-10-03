import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/public";
import { business } from "@/config/business";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Contact Us",
  "Contact Pacific Plains Electric at (805) 626-7761 for electrical services in San Luis Obispo County.",
  "/contact",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT US"
        title="Contact Nicholas & the team"
        description="Call about a repair, discuss a project, or send the details online."
      />
      <section className="section container two-column">
        <div className="contact-list">
          <div className="contact-item">
            <Phone />
            <div>
              <small>WORK PHONE · PRIMARY</small>
              <a href={business.workPhone.tel}>
                <h3>{business.workPhone.display}</h3>
              </a>
              <small>
                Automated assistant answers 24/7. Electrician visits are by
                appointment.
              </small>
            </div>
          </div>
          <div className="contact-item">
            <Phone />
            <div>
              <small>NICHOLAS KANE · DIRECT LINE</small>
              <a href={business.directPhone.tel}>
                {business.directPhone.display}
              </a>
            </div>
          </div>
          <div className="contact-item">
            <Mail />
            <div>
              <small>EMAIL</small>
              <a href={"mailto:" + business.email}>{business.email}</a>
            </div>
          </div>
          <div className="contact-item">
            <Clock />
            <div>
              <small>BUSINESS HOURS</small>
              {business.hours.display}
              <small>Appointment days confirmed individually.</small>
            </div>
          </div>
          <Link
            className="button"
            style={{ alignSelf: "flex-start" }}
            href="/request-service"
          >
            Request Service <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="map-panel">
          <svg viewBox="0 0 180 220" aria-hidden="true">
            <path
              d="M50 5h77l-1 76 44 85-43 45-30-17-24-40-16-27-18-26-9-40z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M40 110l24 9 26 46"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
            />
            <circle cx="69" cy="142" r="7" fill="var(--gold)" />
            <circle cx="69" cy="142" r="16" stroke="var(--gold)" fill="none" />
          </svg>
          <h3>San Luis Obispo County</h3>
          <p>
            <MapPin size={16} /> San Luis Obispo County
          </p>
          <small>Service-area business · no public storefront</small>
          <a
            className="text-link"
            href="https://www.google.com/maps/search/San+Luis+Obispo+County+California"
            target="_blank"
            rel="noreferrer"
          >
            View service area on Google Maps <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </>
  );
}
