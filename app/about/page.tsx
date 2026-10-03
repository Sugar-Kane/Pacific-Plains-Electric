import {
  PageHero,
  AboutSection,
  TrustStrip,
  ContactCTA,
} from "@/components/public";
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
        eyebrow="ABOUT PACIFIC PLAINS"
        title="Local. Reliable. Built for the coast."
        description="Electrical service with a straightforward approach: understand the work, discuss the next step, and keep communication clear."
      />
      <AboutSection />
      <TrustStrip />
      <section className="container content-narrow">
        <h2>A local business you can reach.</h2>
        <p>
          Pacific Plains Electric is owned by Nicholas Kane and serves
          residential and commercial customers in San Luis Obispo County,
          California.
        </p>
        <p>
          For service inquiries, call{" "}
          <a href={business.workPhone.tel}>{business.workPhone.display}</a>. The
          work number is answered by the Volteira AI phone assistant. To speak
          directly with Nicholas, call{" "}
          <a href={business.directPhone.tel}>{business.directPhone.display}</a>.
        </p>
        <p>California contractor license: {business.license}.</p>
      </section>
      <ContactCTA />
    </>
  );
}
