import Link from "next/link";
import Brand from "./brand";
import { Phone, ArrowUpRight } from "lucide-react";
import { business } from "@/config/business";
export default function Footer() {
  return (
    <>
      <footer>
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              Local. Reliable.
              <br />
              Built for the Central Coast.
            </p>
            <small>{business.license}</small>
          </div>
          <div>
            <h3>Explore</h3>
            {[
              ["Services", "/services"],
              ["About us", "/about"],
              ["Projects", "/projects"],
              ["From the blog", "/blog"],
              ["Common questions", "/faq"],
            ].map(([t, h]) => (
              <Link key={h} href={h}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h3>Let’s get to work</h3>
            <a href={business.workPhone.tel}>{business.workPhone.display}</a>
            <small>24/7 AI phone assistant</small>
            <a href={"mailto:" + business.email}>{business.email}</a>
            <Link href="/request-service">Request service ↗</Link>
          </div>
          <div>
            <h3>Our community</h3>
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
      <div className="mobile-action-bar">
        <a href={business.workPhone.tel}>
          <Phone size={18} /> Call
        </a>
        <Link href="/request-service">
          Request Service <ArrowUpRight size={18} />
        </Link>
      </div>
    </>
  );
}
