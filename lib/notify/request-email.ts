import "server-only";
import { business } from "@/config/business";
import { findService } from "@/config/content";
import type { ServiceRequestInput } from "@/lib/security/validation";

/** Collapse whitespace so customer text can't add header-like lines to the subject. */
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** Plain-text notification for the owner. No HTML, so nothing the customer typed can render. */
export function buildRequestEmail(input: ServiceRequestInput, reference: string) {
  const service = findService(input.service)?.name ?? input.service;
  const name = oneLine(`${input.firstName} ${input.lastName}`);
  const lines = [
    `New service request from the website.`,
    ``,
    `Service: ${service}`,
    `Name: ${name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Prefers contact by: ${input.contactMethod}`,
    `Address: ${oneLine(input.address)}, ${oneLine(input.city)} ${input.postalCode}`,
    `Preferred times: ${oneLine(input.preferredTimes) || "Not given"}`,
    `OK to text: ${input.smsConsent ? "Yes" : "No"}`,
    ``,
    `Description:`,
    input.description,
    ``,
    `Reference: ${reference}`,
    `This is not a confirmed appointment. The customer has not been sent a confirmation.`,
    `Reply to this email to reach the customer directly.`,
  ];
  return {
    subject: oneLine(`New request: ${service} – ${name}, ${input.city}`).slice(0, 180),
    text: lines.join("\n"),
  };
}

/**
 * Emails the owner through Resend when RESEND_API_KEY and REQUEST_EMAIL_FROM
 * are set. The request is already saved before this runs, so a failure is
 * logged and never shown to the customer. The reference doubles as Resend's
 * idempotency key, so a retried submission doesn't send twice.
 */
export async function sendRequestEmail(input: ServiceRequestInput, reference: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REQUEST_EMAIL_FROM;
  if (!key || !from) {
    console.warn("Request email not sent: RESEND_API_KEY or REQUEST_EMAIL_FROM is not set.");
    return false;
  }
  const { subject, text } = buildRequestEmail(input, reference);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `request-${reference}`,
      },
      body: JSON.stringify({
        from,
        to: [process.env.REQUEST_EMAIL_TO || business.email],
        reply_to: input.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`Request email failed for ${reference}: HTTP ${res.status}`);
    return res.ok;
  } catch {
    console.error(`Request email failed for ${reference}: network error`);
    return false;
  }
}
