/**
 * Google Analytics events. A no-op until components/analytics.tsx has loaded
 * gtag, which only happens when NEXT_PUBLIC_GA_ID is set.
 *
 * Never pass anything a visitor typed or that identifies them (names, phone
 * numbers, emails, addresses, descriptions): the privacy page promises that
 * none of it reaches analytics.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, string> = {}) {
  window.gtag?.("event", name, params);
}

/** Why a service request did not go through, from the API's HTTP status. */
export function requestFailureReason(status?: number) {
  if (status === undefined) return "network";
  if (status === 400 || status === 413 || status === 415) return "invalid_details";
  if (status === 403) return "blocked";
  if (status === 422) return "hazard_warning";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server_error";
  return "unconfirmed";
}
