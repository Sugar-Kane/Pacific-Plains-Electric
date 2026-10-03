import { PageHero } from "@/components/public";
import { business } from "@/config/business";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Privacy",
  "How the Pacific Plains Electric website handles service inquiries and website preferences.",
  "/privacy",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="PRIVACY"
        title="Your information, handled with care."
        description="This notice describes the information collected through this website."
      />
      <div className="container">
        <article className="content-narrow">
          <h2>Service inquiries</h2>
          <p>
            When you submit a service request, we collect the contact
            information, service address, project description, preferred times,
            and communication choices you provide. We use these details to
            review and respond to your request and coordinate service.
          </p>
          <h2>Storage and service providers</h2>
          <p>
            Website requests are stored in our Supabase database and the website
            is hosted by Vercel. Requests are currently reviewed through the
            website’s protected owner area. When the Volteira integration is
            activated, service information may be transferred to that business
            management system to coordinate your work.
          </p>
          <h2>Preferences and technical information</h2>
          <p>
            The website remembers your theme preference in your browser.
            Authentication cookies support owner sign-in. Hosting services may
            process technical request information for security and operation. We
            do not send form names, phone numbers, email addresses, service
            addresses, or descriptions to general analytics.
          </p>
          <h2>Communication choices</h2>
          <p>
            Service-related contact consent is separate from optional
            text-message consent. We do not enroll you in marketing through the
            request form. If you opt into transactional texts, message frequency
            varies and message and data rates may apply. Reply STOP to opt out
            or HELP for help. No automated email or text delivery is currently
            promised by this website.
          </p>
          <h2>Questions and requests</h2>
          <p>
            Contact <a href={"mailto:" + business.email}>{business.email}</a>{" "}
            with privacy questions or to request access, correction, or deletion
            of information you submitted. Some information may need to be
            retained for applicable business or legal requirements.
          </p>
        </article>
      </div>
    </>
  );
}
