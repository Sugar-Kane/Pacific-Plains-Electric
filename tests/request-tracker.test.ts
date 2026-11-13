import test from "node:test";
import assert from "node:assert/strict";
import { shortReference } from "../lib/reference";
import { matchesQuery, parseTrackerParams, trackRequests, trackerHref, type TrackedRequest } from "../lib/admin/request-tracker";

// Synthetic requests only; no real customer data.
const row = (id: string, status: string, minutesAgo: number, payload: TrackedRequest["payload"]): TrackedRequest => ({
  id,
  status,
  created_at: new Date(Date.UTC(2026, 10, 1) - minutesAgo * 60_000).toISOString(),
  payload,
});
const maria = row("3f2a9c1b-0000-4000-8000-000000000001", "received", 1, {
  firstName: "María José", lastName: "López", phone: "(805) 555-0100", email: "maria@example.invalid", city: "Arroyo Grande", service: "lighting",
});
const sam = row("a1b2c3d4-0000-4000-8000-000000000002", "reviewed", 2, {
  firstName: "Sam", lastName: "Rivera", phone: "805.555.0199", email: "", city: "Santa Maria", service: "panel-upgrades",
});
const lee = row("ffee0011-0000-4000-8000-000000000003", "synced", 3, {
  firstName: "Lee", lastName: "Chen", phone: "+1 805 555 0123", email: "lee@example.invalid", city: "Nipomo", service: "ev-charger-installation",
});
const rows = [maria, sam, lee];

test("the reference is the customer's 8-character code", () => {
  assert.equal(shortReference(maria.id), "3F2A9C1B");
});

test("search finds a request by its reference number in any form", () => {
  for (const q of ["3F2A9C1B", "3f2a9c1b", "ref 3F2A9C1B", "Reference: 3F2A-9C1B", "#3f2a9c1b", maria.id, "3F2A"]) {
    assert.deepEqual(rows.filter((r) => matchesQuery(r, q)).map((r) => r.id), [maria.id], q);
  }
});

test("search finds a request by phone whatever the formatting", () => {
  for (const q of ["8055550100", "805-555-0100", "(805) 555 0100", "1 805 555 0100", "0100"]) {
    assert.deepEqual(rows.filter((r) => matchesQuery(r, q)).map((r) => r.id), [maria.id], q);
  }
  assert.deepEqual(rows.filter((r) => matchesQuery(r, "8055550123")).map((r) => r.id), [lee.id]);
});

test("search finds a request by name, email, city or service, ignoring case and accents", () => {
  const ids = (q: string) => rows.filter((r) => matchesQuery(r, q)).map((r) => r.id);
  assert.deepEqual(ids("jose lopez"), [maria.id]);
  assert.deepEqual(ids("MARÍA JOSÉ"), [maria.id]);
  assert.deepEqual(ids("maria"), [maria.id, sam.id]); // Sam lives in Santa Maria
  assert.deepEqual(ids("lee@example"), [lee.id]);
  assert.deepEqual(ids("santa maria"), [sam.id]);
  assert.deepEqual(ids("panel"), [sam.id]);
  assert.deepEqual(ids("rivera chen"), []);
  assert.deepEqual(ids("   "), rows.map((r) => r.id));
});

test("status filter, counts and paging", () => {
  const all = trackRequests(rows, { q: "", status: "all", page: 1 });
  assert.deepEqual(all.counts, { all: 3, new: 1, reviewed: 2 });
  assert.equal(all.total, 3);
  assert.deepEqual(trackRequests(rows, { q: "", status: "new", page: 1 }).items.map((r) => r.id), [maria.id]);
  assert.deepEqual(trackRequests(rows, { q: "", status: "reviewed", page: 1 }).items.map((r) => r.id), [sam.id, lee.id]);
  const paged = trackRequests(rows, { q: "", status: "all", page: 9 }, 2);
  assert.deepEqual([paged.page, paged.pages, paged.from, paged.to], [2, 2, 3, 3]);
  const none = trackRequests(rows, { q: "nobody", status: "all", page: 1 });
  assert.deepEqual([none.total, none.from, none.to, none.pages], [0, 0, 0, 1]);
});

test("tracker parameters are read defensively and links keep only what is set", () => {
  assert.deepEqual(parseTrackerParams({}), { q: "", status: "all", page: 1 });
  assert.deepEqual(parseTrackerParams({ q: ["  3F2A9C1B "], status: "bogus", page: "-4" }), { q: "3F2A9C1B", status: "all", page: 1 });
  assert.equal(parseTrackerParams({ q: "x".repeat(500) }).q.length, 100);
  assert.equal(trackerHref({}), "/admin/service-requests");
  assert.equal(trackerHref({ q: "María López", status: "new", page: 2 }), "/admin/service-requests?q=Mar%C3%ADa+L%C3%B3pez&status=new&page=2");
});
