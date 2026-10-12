import test from "node:test";
import assert from "node:assert/strict";
import { deliverEmail } from "../lib/notify/resend-transport";
import { buildRequestEmail } from "../lib/notify/request-email-content";
import { requestSchema } from "../lib/security/validation";

const email = { from: "requests@example.invalid", to: ["owner@example.invalid"], subject: "Test", text: "Synthetic" };
function fixture(responses: Array<Response | Error>) {
  const calls: RequestInit[] = [], delays: number[] = [];
  return {
    calls, delays,
    dependencies: {
      fetch: (async (_url, init) => {
        calls.push(init!);
        const next = responses.shift();
        if (next instanceof Error) throw next;
        assert.ok(next);
        return next;
      }) as typeof fetch,
      sleep: async (ms: number) => { delays.push(ms); },
    },
  };
}
test("email retries network and server failures with identical payload and key", async () => {
  const f = fixture([new Error("timeout"), new Response("", { status: 503 }), Response.json({ id: "accepted-id" })]);
  assert.equal(await deliverEmail("test-key", email, "request-1", f.dependencies), true);
  assert.equal(f.calls.length, 3);
  assert.deepEqual(f.delays, [500, 1000]);
  assert.equal(new Set(f.calls.map(x => x.body)).size, 1);
  for (const call of f.calls) assert.equal((call.headers as Record<string, string>)["Idempotency-Key"], "request-1");
});
test("email does not retry permanent failures or claim malformed acceptance", async () => {
  for (const response of [new Response("", { status: 403 }), Response.json({})]) {
    const f = fixture([response]);
    assert.equal(await deliverEmail("test-key", email, "request-2", f.dependencies), false);
    assert.equal(f.calls.length, 1);
  }
});
test("email respects short rate limits and stops for a longer provider window", async () => {
  const f = fixture([new Response("", { status: 429, headers: { "retry-after": "1" } }), Response.json({ id: "accepted" })]);
  assert.equal(await deliverEmail("test", email, "request-3", f.dependencies), true);
  assert.deepEqual(f.delays, [1000]);
  const long = fixture([new Response("", { status: 429, headers: { "retry-after": "60" } })]);
  assert.equal(await deliverEmail("test", email, "request-4", long.dependencies), false);
  assert.equal(long.calls.length, 1);
});
test("email exhausts bounded failures without throwing", async () => {
  const f = fixture([new Error(), new Error(), new Error()]);
  assert.equal(await deliverEmail("test", email, "request-5", f.dependencies), false);
  assert.equal(f.calls.length, 3);
});
test("short request email includes phone fallback and approved diagnostic policy", () => {
  const input = requestSchema.parse({ idempotencyKey: crypto.randomUUID(), firstName: "Test\nCustomer", lastName: "", phone: "8055550100", email: "", address: "", city: "", postalCode: "93401", service: "other", description: "", preferredTimes: "", contactMethod: "phone", transactionalConsent: true, smsConsent: false, website: "" });
  const result = buildRequestEmail(input, "synthetic-reference");
  assert.doesNotMatch(result.subject, /[\r\n]/);
  assert.match(result.text, /Email: Not provided/);
  assert.match(result.text, /Call the customer/);
  assert.match(result.text, /qualifying.*follow-up repairs/);
  assert.match(result.text, /not a confirmed appointment/);
});
