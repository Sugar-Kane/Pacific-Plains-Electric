import { createHmac, timingSafeEqual } from "node:crypto";
/** Proposed adapter contract; must be aligned with the actual Volteira signing specification before activation. */
export function verifyWebhook(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string,
  now = Date.now(),
): boolean {
  if (
    !/^\d+$/.test(timestamp) ||
    !/^sha256=[a-f0-9]{64}$/i.test(signature) ||
    secret.length < 32
  )
    return false;
  if (Math.abs(now - Number(timestamp) * 1000) > 300000) return false;
  const expected = createHmac("sha256", secret)
    .update(timestamp + "." + rawBody)
    .digest();
  const received = Buffer.from(signature.slice(7), "hex");
  return (
    received.length === expected.length && timingSafeEqual(expected, received)
  );
}
