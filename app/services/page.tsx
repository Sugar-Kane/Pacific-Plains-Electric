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
        title="Electrical services"
        description="Repairs and installations for homes and businesses in San Luis Obispo County."
      />
      <section className="section container">
        <ServiceGrid />
      </section>
      <Diagnostic />
      <ContactCTA />
    </>
  );
}
