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
        eyebrow="Services"
        title="Electrical services"
        description="Repairs and installations for homes and businesses in San Luis Obispo County. Pick a service to request it, or read the details first."
      />
      <section className="section container">
        <ServiceGrid />
      </section>
      <Diagnostic />
      <ContactCTA />
    </>
  );
}
