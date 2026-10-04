import { PageHero, ContactCTA, FaqList } from "@/components/public";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Common Questions",
  "Answers about diagnostic pricing, services, service requests, and contacting Pacific Plains Electric.",
  "/faq",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Pricing, service area, scheduling, and how to reach us."
      />
      <div className="container">
        <section className="content-narrow">
          <FaqList />
        </section>
      </div>
      <ContactCTA />
    </>
  );
}
