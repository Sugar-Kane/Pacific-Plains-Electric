import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
const url = process.env.PPE_TEST_DATABASE_URL;
const sql = (statement: string) => {
  if (!url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname))
    throw new Error("Use a disposable localhost database only.");
  return execFileSync("psql", [url, "-X", "-qAt", "-v", "ON_ERROR_STOP=1"], {
    input: statement,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
};
const payload = (phone: string) => ({
  firstName: "Synthetic Local Test",
  lastName: "",
  phone,
  email: "",
  address: "",
  city: "",
  postalCode: "93401",
  service: "other",
  description: "",
  preferredTimes: "",
  contactMethod: "phone",
  transactionalConsent: true,
  smsConsent: false,
  website: "",
});
const literal = (value: unknown) =>
  "'" + JSON.stringify(value).replaceAll("'", "''") + "'::jsonb";
const call = (key: string, value: unknown) =>
  `set role anon; select public.submit_website_request('${key}',${literal(value)}); reset role;`;
test(
  "local database: short/legacy requests, deduplication, throttling, permissions and admin visibility",
  { skip: !url },
  () => {
    const phone = "805" + String(Date.now()).slice(-7),
      key = crypto.randomUUID(),
      value = payload(phone);
    assert.equal(sql(call(key, value)), key);
    assert.equal(sql(call(key, value)), key);
    assert.equal(
      sql(
        `select count(*) from public.website_request_outbox where id='${key}'`,
      ),
      "1",
    );
    assert.throws(
      () => sql(call(key, { ...value, firstName: "Changed" })),
      /Request key already used/,
    );
    for (const patch of [
      { transactionalConsent: false },
      { service: "bad" },
      { smsConsent: true },
      { phone: "----------" },
      { city: "", postalCode: "" },
      { email: "not-email" },
      { contactMethod: "email" },
      { website: "spam" },
    ])
      assert.throws(
        () => sql(call(crypto.randomUUID(), { ...value, ...patch })),
        /Invalid/,
      );
    for (let i = 0; i < 2; i++) sql(call(crypto.randomUUID(), value));
    assert.throws(
      () => sql(call(crypto.randomUUID(), value)),
      /limit exceeded/,
    );
    // Normalization prevents formatting changes from avoiding the phone limit.
    assert.throws(
      () =>
        sql(
          call(crypto.randomUUID(), {
            ...value,
            phone: `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`,
          }),
        ),
      /limit exceeded/,
    );
    const email = `local-${key}@example.invalid`;
    for (let i = 0; i < 3; i++)
      sql(
        call(crypto.randomUUID(), {
          ...payload(`806${String(Date.now()).slice(-6)}${i}`),
          email,
          lastName: "Customer",
          address: "100 Synthetic Street",
          city: "Nipomo",
          description: "Local synthetic test",
          contactMethod: "email",
        }),
      );
    assert.throws(
      () =>
        sql(
          call(crypto.randomUUID(), {
            ...payload(`807${String(Date.now()).slice(-7)}`),
            email,
          }),
        ),
      /limit exceeded/,
    );
    assert.throws(
      () => sql("set role anon; select * from public.website_request_outbox;"),
      /permission denied/,
    );
    assert.equal(
      sql(
        "set role authenticated; select count(*) from public.website_request_outbox;",
      ),
      "0",
    );
    assert.equal(
      sql(
        "select business->>'diagnosticFeeAppliedToWork' from public.website_settings",
      ),
      "true",
    );
    assert.equal(
      sql("select tgenabled from pg_trigger where tgname='settings_audit'"),
      "O",
    );
    const owner = crypto.randomUUID();
    // Synthetic auth record is local only; reuse a seeded owner membership.
    sql(
      `insert into auth.users(id,email,email_confirmed_at) values('${owner}','nick@pacificplainselectric.com',now()); grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`,
    );
    assert.equal(
      sql(
        `set request.jwt.claim.sub='${owner}'; set role authenticated; select count(*) from public.website_request_outbox where id='${key}';`,
      ),
      "1",
    );
    assert.equal(
      sql(
        "select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','ppe_private') and c.relname in ('website_request_outbox','request_receipts') and not c.relrowsecurity",
      ),
      "0",
    );
  },
);
