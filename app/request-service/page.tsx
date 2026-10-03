import { PageHero } from "@/components/public";
import RequestForm from "@/components/request-form";
import { business } from "@/config/business";
import { services } from "@/config/content";
import { metadata as meta } from "@/lib/seo";
import { Phone, ShieldCheck } from "lucide-react";
export const metadata = meta(
  "Request Service",
  "Request electrical service in San Luis Obispo County. Diagnostic service is $180. Appointments are coordinated after your request.",
  "/request-service",
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="LET’S GET STARTED"
        title="Tell us what you need."
        description="Online appointment scheduling is not currently enabled. Send us your service request and we’ll help coordinate your appointment."
      />
      <section className="section container two-column">
        <RequestForm
          initialService={
            services.some((s) => s.slug === service)
              ? service!
              : "troubleshooting"
          }
        />
        <aside className="request-aside panel">
          <span className="eyebrow">KNOW BEFORE YOU REQUEST</span>
          <h2>Electrical diagnostic</h2>
          <div className="price-display">
            ${business.diagnosticPrice}
            <small> / visit</small>
          </div>
          <p>
            Professional troubleshooting and evaluation. Repairs and project
            work are additional. The fee is not automatically credited toward
            repairs.
          </p>
          <div className="notice">
            A request is not an appointment. We’ll coordinate the next step with
            you.
          </div>
          <a className="text-link" href={business.workPhone.tel}>
            <Phone size={18} />
            {business.workPhone.display}
          </a>
          <p>24/7 AI phone assistant</p>
          <small>
            <ShieldCheck size={15} /> {business.license}
          </small>
        </aside>
      </section>
    </>
  );
}
