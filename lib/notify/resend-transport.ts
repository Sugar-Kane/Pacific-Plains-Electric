type Email = { from: string; to: string[]; reply_to?: string; subject: string; text: string };
type Dependencies = { fetch: typeof fetch; sleep: (ms: number) => Promise<void> };

/** Bounded transient retries reuse identical payload and idempotency key. No customer data is logged. */
export async function deliverEmail(
  key: string,
  email: Email,
  idempotencyKey: string,
  dependencies: Dependencies = {
    fetch: globalThis.fetch,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  },
): Promise<boolean> {
  const body = JSON.stringify(email);
  for (let attempt = 0; attempt < 3; attempt++) {
    let delay = 500 * 2 ** attempt;
    try {
      const response = await dependencies.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok) {
        const result = await response.json();
        return typeof result?.id === "string" && result.id.length > 0;
      }
      if (response.status !== 429 && response.status < 500) return false;
      const retryAfter = response.headers.get("retry-after");
      if (retryAfter) {
        const seconds = Number(retryAfter);
        const wait = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now();
        // Do not retry before the provider's window or keep a request alive indefinitely.
        if (wait > 2000) return false;
        if (Number.isFinite(wait)) delay = Math.max(delay, wait);
      }
    } catch {
      // A timeout may have been accepted upstream; the same key prevents duplication.
    }
    if (attempt < 2) await dependencies.sleep(delay);
  }
  return false;
}
