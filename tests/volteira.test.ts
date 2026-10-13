import test from "node:test";
import assert from "node:assert/strict";
import { forwardServiceRequest, volteiraConfig, volteiraPayload } from "../lib/volteira/forward";
import { buildRequestEmail } from "../lib/notify/request-email-content";
import { requestSchema } from "../lib/security/validation";

const config = { url: "https://volteira.example.invalid", key: "vwk_synthetic" };
const disclosure = { smsDisclosure: "I agree to receive transactional text messages. Reply STOP to opt out.", site: "example.invalid" };
const input = (overrides: Record<string, unknown> = {}) =>
  requestSchema.parse({
    idempotencyKey: crypto.randomUUID(), firstName: "Test", lastName: "Customer", phone: "8055550100", email: "",
    address: "1 Test St", city: "Testville", postalCode: "93401", service: "panel-upgrades", description: "Breaker trips",
    preferredTimes: "Mornings", contactMethod: "text", transactionalConsent: true, smsConsent: true, website: "",
    ...overrides,
  });
const reference = "8d6f0c4e-2b1a-4c3d-9e8f-7a6b5c4d3e2f";

function fixture(responses: Array<Response | Error>) {
  const calls: { url: string; init: RequestInit }[] = [], delays: number[] = [];
  return {
    calls, delays,
    dependencies: {
      fetch: (async (url, init) => {
        calls.push({ url: String(url), init: init! });
        const next = responses.shift();
        if (next instanceof Error) throw next;
        assert.ok(next);
        return next;
      }) as typeof fetch,
      sleep: async (ms: number) => { delays.push(ms); },
    },
  };
}

test("Volteira is only sent requests when switched on, with both values, over https", () => {
  const live = { VOLTEIRA_MODE: "live", VOLTEIRA_API_URL: "https://www.volteira.example/", VOLTEIRA_API_KEY: "vwk_x" };
  assert.deepEqual(volteiraConfig(live), { url: "https://www.volteira.example", key: "vwk_x" });
  assert.equal(volteiraConfig({ ...live, VOLTEIRA_MODE: "unavailable" }), null);
  assert.equal(volteiraConfig({ ...live, VOLTEIRA_API_KEY: " " }), null);
  assert.equal(volteiraConfig({ ...live, VOLTEIRA_API_URL: undefined }), null);
  assert.equal(volteiraConfig({ ...live, VOLTEIRA_API_URL: "http://volteira.example" }), null, "never sends the key in the clear");
  assert.equal(volteiraConfig({ ...live, VOLTEIRA_API_URL: "not a url" }), null);
});

test("consent goes to Volteira only with the words the customer agreed to", () => {
  const ticked = volteiraPayload(input(), reference, disclosure);
  assert.equal(ticked.smsConsent, true);
  assert.equal(ticked.smsDisclosure, disclosure.smsDisclosure);
  assert.equal(ticked.reference, reference);
  assert.equal(ticked.serviceName, "Electrical Panels & Breakers");
  const unticked = volteiraPayload(input({ contactMethod: "phone", smsConsent: false }), reference, disclosure);
  assert.equal(unticked.smsConsent, false);
  assert.equal(unticked.smsDisclosure, "");
});

test("a request is sent once with the key, and a resend after a failure is the same request", async () => {
  const f = fixture([
    new Error("timeout"),
    new Response("", { status: 503 }),
    Response.json({ requestId: "vr-1", duplicate: false, text: "queued" }, { status: 201 }),
  ]);
  const payload = volteiraPayload(input(), reference, disclosure);
  assert.deepEqual(await forwardServiceRequest(config, payload, f.dependencies), {
    sent: true, volteiraId: "vr-1", duplicate: false, texting: true,
  });
  assert.equal(f.calls.length, 3);
  assert.deepEqual(f.delays, [500, 1000]);
  assert.equal(new Set(f.calls.map((c) => c.init.body)).size, 1, "every attempt carries the same reference");
  for (const call of f.calls) {
    assert.equal(call.url, "https://volteira.example.invalid/api/intake/website");
    assert.equal((call.init.headers as Record<string, string>).Authorization, "Bearer vwk_synthetic");
  }
});

test("a refused request is not retried, and a malformed answer is not taken as accepted", async () => {
  for (const status of [400, 401, 413]) {
    const f = fixture([Response.json({ error: "no" }, { status })]);
    assert.deepEqual(await forwardServiceRequest(config, volteiraPayload(input(), reference, disclosure), f.dependencies), { sent: false, reason: "refused" });
    assert.equal(f.calls.length, 1);
  }
  const malformed = fixture([Response.json({})]);
  assert.deepEqual(await forwardServiceRequest(config, volteiraPayload(input(), reference, disclosure), malformed.dependencies), { sent: false, reason: "unreachable" });
});

test("a Volteira outage ends after bounded retries without throwing", async () => {
  const f = fixture([new Response("", { status: 429 }), new Error(), new Response("", { status: 500 })]);
  assert.deepEqual(await forwardServiceRequest(config, volteiraPayload(input(), reference, disclosure), f.dependencies), { sent: false, reason: "unreachable" });
  assert.equal(f.calls.length, 3);
});

test("the owner email says whether the request reached Volteira", () => {
  assert.doesNotMatch(buildRequestEmail(input(), reference).text, /Volteira/, "unchanged while the connection is off");
  const texting = buildRequestEmail(input(), reference, { sent: true, volteiraId: "vr-1", duplicate: false, texting: true }).text;
  assert.match(texting, /In Volteira ✓/);
  assert.match(texting, /assistant is texting them/);
  assert.doesNotMatch(texting, /Text the customer at the phone number above/, "nobody is told to text them twice");
  assert.match(buildRequestEmail(input(), reference, { sent: false, reason: "unreachable" }).text, /Not in Volteira yet: add it by hand\./);
});
