import { PageHero, PricingPanel } from "@/components/public";
import RequestForm from "@/components/request-form";
import { findService } from "@/config/content";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Request Electrical Service",
  "Request electrical service from Pacific Plains Electric in San Luis Obispo County. Diagnostic visits are $180, and we'll contact you to confirm a time.",
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
        eyebrow="Request service"
        title="Tell us about the job"
        description="Takes about two minutes. We’ll get back to you to talk through the work and set a time."
      />
      <section className="section container two-column">
        <RequestForm
          initialService={(service && findService(service)?.requestAs) || "troubleshooting"}
        />
        <PricingPanel>
          <div className="notice">
            Sending a request doesn’t book an appointment. We’ll confirm a time
            with you.
          </div>
        </PricingPanel>
      </section>
    </>
  );
}
