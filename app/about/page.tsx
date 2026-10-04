import { PageHero, OwnerSection, Facts, ContactCTA } from "@/components/public";
import { business } from "@/config/business";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "About Us",
  "Meet Pacific Plains Electric, owned by Nicholas Kane and serving San Luis Obispo County. CSLB #1162180.",
  "/about",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A local electrical contractor you can reach"
        description="Pacific Plains Electric serves residential and commercial customers across San Luis Obispo County."
      />
      <OwnerSection aboutLink={false} />
      <section className="container">
        <Facts />
      </section>
      <section className="section container">
        <div className="prose">
          <h2>How to reach us</h2>
          <p>
            For service, call the main line at{" "}
            <a href={business.workPhone.tel}>{business.workPhone.display}</a>.
            It’s answered by an automated phone assistant, so you can call any
            time. To speak with Nicholas directly, call{" "}
            <a href={business.directPhone.tel}>{business.directPhone.display}</a>{" "}
            or email <a href={"mailto:" + business.email}>{business.email}</a>.
          </p>
          <p>
            Office hours are {business.hours.display}. Visits are scheduled by
            appointment.
          </p>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
