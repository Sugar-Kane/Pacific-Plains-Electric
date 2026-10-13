import { diagnosticTerms } from "@/config/business";
import { intakeServiceName } from "@/config/intake";
import type { ServiceRequestInput } from "@/lib/security/validation";

/** Collapse whitespace so customer text can't add header-like lines to the subject. */
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** Plain-text notification for the owner. No HTML, so nothing the customer typed can render. */
export function buildRequestEmail(
  input: ServiceRequestInput,
  reference: string,
) {
  const service = intakeServiceName(input.service);
  const name = oneLine(`${input.firstName} ${input.lastName}`);
  const lines = [
    `New service request from the website.`,
    ``,
    `Service: ${service}`,
    `Name: ${name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email || "Not provided"}`,
    `Preferred language: ${input.preferredLanguage === "es" ? "Spanish" : "English"}`,
    `Prefers contact by: ${input.contactMethod}`,
    `Location: ${[input.address, input.city, input.postalCode].filter(Boolean).map(oneLine).join(", ")}`,
    `Preferred times: ${oneLine(input.preferredTimes) || "Not given"}`,
    `OK to text: ${input.smsConsent ? "Yes" : "No"}`,
    ``,
    `Description:`,
    input.description || "Not provided",
    diagnosticTerms,
    ``,
    `Reference: ${reference}`,
    `This is not a confirmed appointment. The customer has not been sent a confirmation.`,
    input.contactMethod === "text"
      ? "Text the customer at the phone number above; SMS consent is recorded."
      : input.email
      ? `Reply to this email to reach the customer directly.`
      : `Call the customer at the phone number above.`,
  ];
  return {
    subject: oneLine(`New request: ${service} – ${name}, ${input.city}`).slice(
      0,
      180,
    ),
    text: lines.join("\n"),
  };
}

