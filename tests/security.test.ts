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
  assert.equal(business.diagnosticFeeAppliedToWork, true);
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

test("short inquiries accept city or ZIP without email, address, or description", () => {
  const minimal = {
    ...request,
    email: "",
    address: "",
    description: "",
    contactMethod: "phone",
    city: "",
    postalCode: "93401",
  };
  assert.ok(requestSchema.safeParse(minimal).success);
  assert.ok(
    requestSchema.safeParse({ ...minimal, city: "Nipomo", postalCode: "" })
      .success,
  );
  for (const patch of [
    { city: "", postalCode: "" },
    { city: "1234", postalCode: "" },
    { contactMethod: "email" },
    { firstName: "  " },
  ])
    assert.equal(
      requestSchema.safeParse({ ...minimal, ...patch }).success,
      false,
    );
  assert.ok(requestSchema.safeParse({ ...minimal, service: "other" }).success);
});

test("all authorized ZIPs are recognized, with ZIP+4 and boundary handling", async () => {
  const { servedZips, crossCountyZips, coverageMessage } =
    await import("../config/coverage");
  assert.equal(servedZips.length, 78);
  for (const zip of servedZips) {
    assert.match(zip, /^\d{5}$/);
    assert.match(
      coverageMessage(zip),
      /coverage area|part of our service area/,
    );
    assert.equal(coverageMessage(zip), coverageMessage(zip + "-1234"));
  }
  assert.ok(crossCountyZips.includes("93252"));
  assert.match(coverageMessage("10001"), /still send a request/);
});

test("text preference requires explicit SMS consent", () => {
  assert.equal(requestSchema.safeParse({ ...request, contactMethod: "text", smsConsent: false }).success, false);
  assert.equal(requestSchema.safeParse({ ...request, contactMethod: "text", smsConsent: true }).success, true);
});

test("a request needs both a first and a last name", () => {
  for (const name of [{ lastName: "" }, { lastName: "   " }, { firstName: "" }]) {
    const result = requestSchema.safeParse({ ...request, ...name });
    assert.equal(result.success, false, JSON.stringify(name));
  }
  const missing = requestSchema.safeParse({ ...request, lastName: "" });
  assert.equal(!missing.success && missing.error.issues[0]?.message, "Enter your last name.");
});
