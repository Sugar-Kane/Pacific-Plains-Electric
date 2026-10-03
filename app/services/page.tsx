import {
  PageHero,
  ServiceGrid,
  Diagnostic,
  ContactCTA,
} from "@/components/public";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Electrical Services",
  "Electrical repair, panel upgrades, EV chargers, lighting, and commercial electrical services in San Luis Obispo County.",
  "/services",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Practical help. Professional work."
        description="Electrical services for homes and businesses throughout San Luis Obispo County. Tell us what you need, and we’ll talk through the next step."
      />
      <section className="section container">
        <ServiceGrid />
      </section>
      <Diagnostic />
      <ContactCTA />
    </>
  );
}
