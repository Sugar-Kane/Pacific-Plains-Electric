import { PageHero, ContactCTA } from "@/components/public";
import { faqs } from "@/config/content";
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
        eyebrow="COMMON QUESTIONS"
        title="A clear answer is a good start."
        description="A few useful details before you get in touch."
      />
      <div className="container">
        <section className="content-narrow">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </div>
      <ContactCTA />
    </>
  );
}
