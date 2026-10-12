import "server-only";
import { business } from "@/config/business";
import type { ServiceRequestInput } from "@/lib/security/validation";
import { buildRequestEmail } from "./request-email-content";
import { deliverEmail } from "./resend-transport";

/** The database save succeeds independently of this best-effort owner notification. */
export async function sendRequestEmail(input: ServiceRequestInput, reference: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REQUEST_EMAIL_FROM;
  if (!key || !from) {
    console.warn("Request email not sent: RESEND_API_KEY or REQUEST_EMAIL_FROM is not set.");
    return false;
  }
  const { subject, text } = buildRequestEmail(input, reference);
  const accepted = await deliverEmail(key, {
    from,
    to: [process.env.REQUEST_EMAIL_TO || business.email],
    ...(input.email ? { reply_to: input.email } : {}),
    subject,
    text,
  }, `request-${reference}`);
  if (!accepted) console.error(`Request email not accepted for ${reference}; review the admin inbox.`);
  return accepted;
}
