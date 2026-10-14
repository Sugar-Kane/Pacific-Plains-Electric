import { intakeServiceName } from "@/config/intake";
import type { ServiceRequestInput } from "@/lib/security/validation";

/**
 * Sends a saved website request on to Volteira, where it lands in Booking
 * requests and Volteira's assistant can text the customer.
 *
 * The site's request id is the idempotency key, so a retry after a timeout finds
 * the request Volteira already made instead of making a second one. Only network
 * errors, 429 and 5xx are retried; a 4xx is a request Volteira will never take,
 * and sending it again changes nothing.
 */

export type VolteiraConfig = { url: string; key: string };

export type ForwardOutcome =
  | { sent: true; volteiraId: string; duplicate: boolean; texting: boolean }
  | { sent: false; reason: "refused" | "unreachable" };

type Dependencies = { fetch: typeof fetch; sleep: (ms: number) => Promise<void> };

/** Live only when switched on and both values are set; otherwise nothing is sent, as before. */
export function volteiraConfig(env: Record<string, string | undefined>): VolteiraConfig | null {
  if (env.VOLTEIRA_MODE !== "live") return null;
  const key = env.VOLTEIRA_API_KEY?.trim();
  const raw = env.VOLTEIRA_API_URL?.trim();
  if (!key || !raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return null;
    return { url: url.origin, key };
  } catch {
    return null;
  }
}

/** The fields Volteira's website intake reads. Consent travels with the words it was given against. */
export function volteiraPayload(
  input: ServiceRequestInput,
  reference: string,
  consent: { smsDisclosure: string; site: string },
) {
  return {
    reference,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    postalCode: input.postalCode,
    service: input.service,
    serviceName: intakeServiceName(input.service),
    description: input.description,
    preferredTimes: input.preferredTimes,
    preferredLanguage: input.preferredLanguage,
    contactMethod: input.contactMethod,
    smsConsent: input.smsConsent,
    smsDisclosure: input.smsConsent ? consent.smsDisclosure : "",
    site: consent.site,
  };
}

export async function forwardServiceRequest(
  config: VolteiraConfig,
  payload: ReturnType<typeof volteiraPayload>,
  dependencies: Dependencies = {
    fetch: globalThis.fetch,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  },
): Promise<ForwardOutcome> {
  const body = JSON.stringify(payload);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await dependencies.fetch(`${config.url}/api/intake/website`, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.key}`, "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { requestId?: unknown; duplicate?: unknown; text?: unknown }
          | null;
        if (typeof result?.requestId !== "string" || !result.requestId) return { sent: false, reason: "unreachable" };
        return {
          sent: true,
          volteiraId: result.requestId,
          duplicate: result.duplicate === true,
          texting: result.text === "queued",
        };
      }
      if (response.status !== 429 && response.status < 500) return { sent: false, reason: "refused" };
    } catch {
      // A timeout may have been saved upstream; the same reference finds it next time.
    }
    if (attempt < 2) await dependencies.sleep(500 * 2 ** attempt);
  }
  return { sent: false, reason: "unreachable" };
}
