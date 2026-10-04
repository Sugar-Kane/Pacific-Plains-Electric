import Link from "next/link";
import Brand from "./brand";
import { Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { business } from "@/config/business";
export default function Footer() {
  return (
    <>
      <footer>
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              Electrical repairs and installations.
              <br />
              San Luis Obispo County.
            </p>
            <small>{business.license}</small>
          </div>
          <div>
            <h3>Explore</h3>
            {[
              ["Services", "/services"],
              ["About us", "/about"],
              ["Project planning guides", "/blog"],
              ["Common questions", "/faq"],
            ].map(([t, h]) => (
              <Link key={h} href={h}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h3>Contact</h3>
            <a href={business.workPhone.tel}>{business.workPhone.display}</a>
            <small>Service inquiries</small>
            <a href={"mailto:" + business.email}>{business.email}</a>
            <Link href="/request-service">Request service ↗</Link>
          </div>
          <div>
            <h3>Service area</h3>
            <p>
              Serving homes and businesses in
              <br />
              San Luis Obispo County, California.
            </p>
            <small>
              {business.hours.display}
              <br />
              Appointment days confirmed individually.
            </small>
          </div>
        </div>
        <div className="container footer-bottom">
          <small>© {new Date().getFullYear()} Pacific Plains Electric</small>
          <span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/admin">Owner sign in</Link>
          </span>
        </div>
      </footer>
      <section className="mobile-action-bar" aria-label="Request Service">
        <h2 className="request-options-label">Request Service</h2>
        <a href={business.workPhone.tel}>
          <Phone size={18} /> Call
        </a>
        <a href={business.workPhone.sms} aria-label="Text Pacific Plains Electric">
          <MessageCircle size={18} /> Text
        </a>
        <Link href="/request-service">
          Online Form <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
