import { Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import CaliforniaMap from "@/components/california-map";
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
          <CaliforniaMap />
          <h3>San Luis Obispo County</h3>
          <p className="map-legend"><span /> Our Central Coast service area</p>
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
