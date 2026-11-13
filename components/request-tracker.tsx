import Link from "next/link";
import { business } from "@/config/business";
import { intakeServiceName } from "@/config/intake";
import { shortReference } from "@/lib/reference";
import {
  statusLabel,
  trackRequests,
  trackerHref,
  type TrackedRequest,
  type TrackerParams,
} from "@/lib/admin/request-tracker";
import { markNew, markReviewed } from "@/app/admin/actions";

const when = new Intl.DateTimeFormat("en-US", {
  timeZone: business.timezone,
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * Every request submitted on the website, newest first, each with the reference
 * number the customer was shown. Search, the status filter and paging are plain
 * links and a GET form, so the page works without client-side JavaScript.
 */
export default function RequestTracker({
  rows,
  params,
  truncated,
}: {
  rows: TrackedRequest[];
  params: TrackerParams;
  truncated: boolean;
}) {
  const { q, status } = params;
  const view = trackRequests(rows, params);
  const filters = [
    ["all", "All", view.counts.all],
    ["new", "New", view.counts.new],
    ["reviewed", "Reviewed", view.counts.reviewed],
  ] as const;
  return (
    <div className="tracker">
      <form className="tracker-search" role="search" action="/admin/service-requests">
        <label htmlFor="tracker-q">Search by reference number, name, phone or email</label>
        <div className="tracker-search-row">
          <input
            id="tracker-q"
            className="admin-input"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. 3F2A9C1B, Maria Lopez or 805 555 0100"
          />
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <button className="button small" type="submit">
            Search
          </button>
          {q && (
            <Link className="text-link" href={trackerHref({ status })}>
              Clear
            </Link>
          )}
        </div>
      </form>
      <nav className="tracker-filters" aria-label="Filter requests by status">
        {filters.map(([value, label, count]) => (
          <Link
            key={value}
            href={trackerHref({ q, status: value })}
            aria-current={status === value ? "page" : undefined}
          >
            {label} <span>{count}</span>
          </Link>
        ))}
      </nav>
      <p className="tracker-summary" role="status">
        {view.total
          ? `Showing ${view.from}–${view.to} of ${view.total} ${view.total === 1 ? "request" : "requests"}`
          : "No requests"}
        {q ? ` matching “${q}”` : ""}
        {status !== "all" ? ` · ${status === "new" ? "New" : "Reviewed"} only` : ""}.
      </p>
      {truncated && (
        <p className="notice">
          Only the newest {rows.length.toLocaleString("en-US")} requests are loaded here. Older ones are still saved.
        </p>
      )}
      {!view.items.length ? (
        <div className="empty-state">
          <h2>{rows.length ? "Nothing matches." : "No requests yet."}</h2>
          <p>
            {rows.length
              ? "Check the reference number or spelling, or clear the search."
              : "Requests submitted on the website will appear here, each with its reference number."}
          </p>
        </div>
      ) : (
        <ul className="tracker-list">
          {view.items.map((r) => {
            const p = r.payload ?? {};
            const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || "No name given";
            const tel = (p.phone ?? "").replace(/[^\d+]/g, "");
            const location = [p.address, p.city, p.postalCode].filter(Boolean).join(", ");
            return (
              <li key={r.id}>
                <details open={Boolean(q) && view.total === 1}>
                  <summary>
                    <span className="tracker-ref" title="Reference number">
                      {shortReference(r.id)}
                    </span>
                    <span className="tracker-who">
                      <strong>{name}</strong>
                      <span>
                        {intakeServiceName(p.service ?? "")} · {when.format(new Date(r.created_at))}
                      </span>
                    </span>
                    <span className={`badge tracker-status tracker-status-${r.status}`}>{statusLabel(r.status)}</span>
                  </summary>
                  <div className="tracker-detail">
                    <dl>
                      <div>
                        <dt>Reference number</dt>
                        <dd>
                          <strong>{shortReference(r.id)}</strong> <small>({r.id})</small>
                        </dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd>{tel ? <a href={`tel:${tel}`}>{p.phone}</a> : "Not provided"}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{p.email ? <a href={`mailto:${p.email}`}>{p.email}</a> : "Not provided"}</dd>
                      </div>
                      <div>
                        <dt>Location</dt>
                        <dd>{location || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt>Preferred contact</dt>
                        <dd>
                          {p.contactMethod || "Not given"} · Texts OK: {p.smsConsent ? "Yes" : "No"} ·{" "}
                          {p.preferredLanguage === "es" ? "Spanish" : "English"}
                        </dd>
                      </div>
                      <div>
                        <dt>Preferred times</dt>
                        <dd>{p.preferredTimes || "None given"}</dd>
                      </div>
                      <div className="tracker-wide">
                        <dt>Description</dt>
                        <dd className="tracker-description">{p.description || "No description provided."}</dd>
                      </div>
                    </dl>
                    {r.status === "received" && (
                      <form action={markReviewed.bind(null, r.id)}>
                        <button className="button small">Mark reviewed</button>
                      </form>
                    )}
                    {r.status === "reviewed" && (
                      <form action={markNew.bind(null, r.id)}>
                        <button className="button small secondary">Move back to New</button>
                      </form>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
      {view.pages > 1 && (
        <nav className="tracker-pages" aria-label="Request pages">
          {view.page > 1 ? (
            <Link href={trackerHref({ q, status, page: view.page - 1 })}>← Newer</Link>
          ) : (
            <span />
          )}
          <span>
            Page {view.page} of {view.pages}
          </span>
          {view.page < view.pages ? (
            <Link href={trackerHref({ q, status, page: view.page + 1 })}>Older →</Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
