/**
 * Service-request tracker for the admin page: search, status filter and paging
 * over the website's stored requests. Pure functions, so they can be tested
 * without a database; the page loads the rows and renders the result.
 */
import { shortReference } from "@/lib/reference";
import { intakeServiceName } from "@/config/intake";

export type RequestPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  service?: string;
  description?: string;
  preferredTimes?: string;
  preferredLanguage?: string;
  contactMethod?: string;
  smsConsent?: boolean;
};

export type TrackedRequest = {
  id: string;
  status: string;
  created_at: string;
  payload: RequestPayload;
};

/** "New" is a request nobody has handled yet; everything else counts as reviewed. */
export const STATUS_FILTERS = ["all", "new", "reviewed"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const statusLabel = (status: string) =>
  ({ received: "New", reviewed: "Reviewed", exported: "Exported", synced: "In Volteira" })[status] ?? status;

const isNew = (r: TrackedRequest) => r.status === "received";

export type TrackerParams = { q: string; status: StatusFilter; page: number };

/** Read ?q=, ?status= and ?page= defensively; anything unexpected falls back to the default. */
export function parseTrackerParams(params: Record<string, string | string[] | undefined>): TrackerParams {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = one(params.q).trim().slice(0, 100);
  const status = (STATUS_FILTERS as readonly string[]).includes(one(params.status)) ? (one(params.status) as StatusFilter) : "all";
  const page = Math.max(1, Math.min(10_000, Number.parseInt(one(params.page), 10) || 1));
  return { q, status, page };
}

/** Lower case without accents, so "jose" finds "José". */
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Does a request match the search box? Any of:
 * - its reference number (the customer's 8-character code, any case, or the full id),
 * - its phone number by digits, whatever formatting either side used,
 * - every word of the query somewhere in the name, email, phone, address or service.
 */
export function matchesQuery(r: TrackedRequest, query: string) {
  const q = query.trim();
  if (!q) return true;
  const compact = q.replace(/^(ref(erence)?|#)[\s:#.-]*/i, "").replace(/[\s#-]/g, "").toLowerCase();
  if (/^[0-9a-f]{4,32}$/.test(compact) && r.id.replace(/-/g, "").toLowerCase().startsWith(compact)) return true;

  const p = r.payload ?? {};
  const digits = q.replace(/\D/g, "");
  const phone = (p.phone ?? "").replace(/\D/g, "");
  const wanted = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (!/[a-z]/i.test(q) && wanted.length >= 3 && phone.includes(wanted)) return true;

  const haystack = fold(
    [p.firstName, p.lastName, p.email, p.phone, p.address, p.city, p.postalCode, p.service && intakeServiceName(p.service), shortReference(r.id)]
      .filter(Boolean)
      .join(" "),
  );
  return fold(q)
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export function statusCounts(rows: TrackedRequest[]) {
  const fresh = rows.filter(isNew).length;
  return { all: rows.length, new: fresh, reviewed: rows.length - fresh };
}

export const PAGE_SIZE = 25;

/** Filter by search and status, then cut out one page (clamped to the last page). */
export function trackRequests(rows: TrackedRequest[], { q, status, page }: TrackerParams, pageSize = PAGE_SIZE) {
  const searched = rows.filter((r) => matchesQuery(r, q));
  const counts = statusCounts(searched);
  const filtered = status === "all" ? searched : searched.filter((r) => (status === "new" ? isNew(r) : !isNew(r)));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  return {
    counts,
    total: filtered.length,
    page: current,
    pages,
    from: filtered.length ? start + 1 : 0,
    to: Math.min(start + pageSize, filtered.length),
    items: filtered.slice(start, start + pageSize),
  };
}

/** Link to the tracker with the given search, filter and page (defaults left out). */
export function trackerHref({ q, status, page }: Partial<TrackerParams>) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status && status !== "all") params.set("status", status);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return "/admin/service-requests" + (query ? `?${query}` : "");
}
