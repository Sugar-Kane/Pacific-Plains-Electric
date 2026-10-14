import { diagnosticTerms } from "@/config/business";
import { intakeServiceName } from "@/config/intake";
import type { ServiceRequestInput } from "@/lib/security/validation";
import type { ForwardOutcome } from "@/lib/volteira/forward";

/** Collapse whitespace so customer text can't add header-like lines to the subject. */
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** Plain-text notification for the owner. No HTML, so nothing the customer typed can render. */
export function buildRequestEmail(
  input: ServiceRequestInput,
  reference: string,
  /** Null while the Volteira connection is off: the email reads as it always has. */
  volteira: ForwardOutcome | null = null,
) {
  const texting = volteira?.sent === true && volteira.texting;
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
    ...(volteira === null
      ? []
      : volteira.sent
        ? [`In Volteira ✓ It's in Booking requests, marked "From your website".`]
        : [`Not in Volteira yet: add it by hand.`]),
    `This is not a confirmed appointment. The customer has not been sent a confirmation.`,
    texting
      ? "Volteira's assistant is texting them for the details and a time; follow the conversation there."
      : input.contactMethod === "text"
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

