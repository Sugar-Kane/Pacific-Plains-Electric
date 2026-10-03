import { PageHero } from "@/components/public";
import { metadata as meta } from "@/lib/seo";
import { business } from "@/config/business";
export const metadata = meta(
  "Website Terms",
  "Terms for website service inquiries, diagnostic pricing, and general information.",
  "/terms",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="WEBSITE TERMS"
        title="A few clear expectations."
        description="Please review these details when using our website."
      />
      <div className="container">
        <article className="content-narrow">
          <h2>Requests and appointments</h2>
          <p>
            A service request is an inquiry, not a confirmed appointment. Online
            appointment scheduling is currently disabled. An appointment must be
            coordinated and confirmed with Pacific Plains Electric.
          </p>
          <h2>Diagnostic pricing</h2>
          <p>
            Diagnostic service is ${business.diagnosticPrice} for professional
            troubleshooting and evaluation. Repairs, materials, and project work
            are separate and discussed before proceeding. The diagnostic fee is
            not automatically credited toward work. Sending a request does not
            make a payment or authorize a charge.
          </p>
          <h2>Service scope</h2>
          <p>
            Availability, service-area coverage for your address, project scope,
            and pricing are confirmed individually. Any agreement for electrical
            work is separate from this website inquiry.
          </p>
          <h2>Information and emergencies</h2>
          <p>
            Website articles and prepared assistant responses are general
            information, not a diagnosis or instructions for doing electrical
            work. The 24/7 AI phone assistant does not imply 24/7 electrician
            dispatch. For an immediate threat, fire, smoke, or injury, move away
            from the hazard and call 911.
          </p>
          <h2>Contact</h2>
          <p>
            Pacific Plains Electric · {business.license}
            <br />
            <a href={business.workPhone.tel}>{business.workPhone.display}</a>
            <br />
            <a href={"mailto:" + business.email}>{business.email}</a>
          </p>
        </article>
      </div>
    </>
  );
}
