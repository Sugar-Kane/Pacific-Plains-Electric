import Link from "next/link";
import { PageHero, ContactCTA, FaqList } from "@/components/public";
import { answeredFaqs } from "@/config/content";
import { metadata as meta, JsonLd, graph, faqNode, breadcrumbNode } from "@/lib/seo";
export const metadata = meta(
  "Electrician FAQ",
  "Answers about Pacific Plains Electric: service area, the $180 diagnostic visit, EV chargers, panel upgrades, scheduling, and how to reach the electrician.",
  "/faq",
);
export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          faqNode(answeredFaqs, "/faq"),
          breadcrumbNode([{ name: "FAQ", path: "/faq" }]),
        )}
      />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Pricing, service area, scheduling, and how to reach us."
      />
      <div className="container">
        <section className="content-narrow">
          <FaqList />
          <p className="after-list">
            More detail is on each <Link href="/services">service page</Link>{" "}
            and in our <Link href="/blog">planning guides</Link>.
          </p>
        </section>
      </div>
      <ContactCTA />
    </>
  );
}
