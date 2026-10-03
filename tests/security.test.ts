import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { business } from "../config/business";
import { requestSchema, hazardMessage } from "../lib/security/validation";
import { verifyWebhook } from "../lib/volteira/webhooks";
import { MockVolteiraProvider } from "../lib/volteira/mock";
const request = {
  idempotencyKey: crypto.randomUUID(),
  firstName: "Test",
  lastName: "Customer",
  phone: "8055550100",
  email: "test@example.invalid",
  address: "100 Test Street",
  city: "San Luis Obispo",
  postalCode: "93401",
  service: "troubleshooting",
  description: "This is a synthetic test only.",
  preferredTimes: "",
  contactMethod: "email" as const,
  transactionalConsent: true as const,
  smsConsent: false,
  website: "",
};
test("pricing and scheduling fail-safe defaults", () => {
  assert.equal(business.diagnosticPrice, 180);
  assert.equal(business.diagnosticFeeAppliedToWork, false);
  assert.equal(business.schedulingEnabled, false);
});
test("intake rejects unknown services, invalid consent and malformed contact data", () => {
  assert.ok(requestSchema.safeParse(request).success);
  for (const patch of [
    { service: "unknown" },
    { transactionalConsent: false },
    { phone: "not a phone" },
    { postalCode: "ABC" },
    { email: "bad" },
    { website: "spam" },
  ])
    assert.equal(
      requestSchema.safeParse({ ...request, ...patch }).success,
      false,
    );
});
test("hazard escalation does not give DIY instructions", () => {
  for (const text of [
    "smoke from outlet",
    "burning smell",
    "hot electrical panel",
    "downed power line",
  ])
    assert.match(hazardMessage(text) || "", /911/);
  assert.equal(hazardMessage("install new lighting"), null);
});
test("webhook rejects tampering, expiration, short secrets, malformed signatures", () => {
  const secret = "x".repeat(48),
    body = '{"id":"event-1"}',
    now = Date.now(),
    stamp = String(Math.floor(now / 1000));
  const sig =
    "sha256=" +
    createHmac("sha256", secret)
      .update(stamp + "." + body)
      .digest("hex");
  assert.equal(verifyWebhook(body, stamp, sig, secret, now), true);
  assert.equal(verifyWebhook(body + "x", stamp, sig, secret, now), false);
  assert.equal(verifyWebhook(body, stamp, sig, secret, now + 400000), false);
  assert.equal(verifyWebhook(body, stamp, "sha256=00", secret, now), false);
  assert.equal(verifyWebhook(body, stamp, sig, "short", now), false);
});
test("test-only provider prevents duplicate and conflicting bookings", async () => {
  const provider = new MockVolteiraProvider();
  const a = await provider.createAppointment({
    ...request,
    slotId: "2030-01-10T16:00:00Z",
  });
  const b = await provider.createAppointment({
    ...request,
    slotId: "2030-01-10T16:00:00Z",
  });
  assert.deepEqual(a, b);
  const conflict = await provider.createAppointment({
    ...request,
    idempotencyKey: crypto.randomUUID(),
    slotId: "2030-01-10T16:00:00Z",
  });
  assert.equal(conflict.ok, false);
  const denied = await provider.getAppointment("guessed-token");
  assert.equal(denied.ok, false);
});
test("Pacific time accounts for daylight saving", () => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: business.timezone,
    hour: "numeric",
    hour12: false,
  });
  assert.equal(fmt.format(new Date("2026-01-15T16:00:00Z")), "08");
  assert.equal(fmt.format(new Date("2026-07-15T16:00:00Z")), "09");
});
