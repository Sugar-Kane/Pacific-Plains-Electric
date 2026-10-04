import Link from "next/link";
import { business } from "@/config/business";
export const metadata = {
  title: "Appointment management",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <section className="error-page container">
      <span className="eyebrow">Appointments</span>
      <h1>We can’t verify this appointment link.</h1>
      <p>
        Online appointment management is not connected yet. Please contact us to
        view, change, or cancel your appointment.
      </p>
      <div className="actions">
        <a className="button" href={business.workPhone.tel}>
          Call {business.workPhone.display}
        </a>
        <Link className="button outline" href="/contact">
          Contact details
        </Link>
      </div>
    </section>
  );
}
