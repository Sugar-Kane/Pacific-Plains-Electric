import { PageHero, PricingPanel } from "@/components/public";
import RequestForm from "@/components/request-form";
import { requestable, findService } from "@/config/content";
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
        title="Request electrical service"
        description="Tell us what you need and how to reach you. We’ll contact you to discuss the details and confirm next steps."
      />
      <section className="section container two-column request-layout">
        <RequestForm
          initialService={
            (service &&
              (requestable.includes(service as (typeof requestable)[number])
                ? service
                : findService(service)?.requestAs)) ||
            "other"
          }
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
