import Link from "next/link";
import { getAdmin } from "@/lib/auth/server";
import {
  Login,
  Scheduling,
  ContentEditor,
  TeamAccess,
} from "@/components/admin";
import { logout } from "@/app/admin/actions";
import RequestTracker from "@/components/request-tracker";
import { loadAllRequests } from "@/lib/admin/load-requests";
import { parseTrackerParams, statusCounts } from "@/lib/admin/request-tracker";
import { diagnosticTerms, business } from "@/config/business";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Website administration",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
const sections = [
  "team",
  "dashboard",
  "appointments",
  "service-requests",
  "customers",
  "jobs",
  "estimates",
  "invoices",
  "calendar",
  "messages",
  "ai",
  "website",
  "blog",
  "projects",
  "reviews",
  "analytics",
  "settings",
  "settings/scheduling",
  "settings/business",
  "settings/integrations",
];
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const path = (await params).path?.join("/") || "dashboard";
  if (!sections.includes(path)) notFound();
  const admin = await getAdmin();
  if (!admin)
    return (
      <div className="container admin-wrap">
        <Login />
      </div>
    );
  const { data: members } =
    path === "team"
      ? await admin.db
          .from("website_members")
          .select("email,role")
          .order("created_at")
      : { data: [] };
  const requests = ["dashboard", "service-requests"].includes(path)
    ? await loadAllRequests(admin.db)
    : { rows: [], error: false, truncated: false };
  const requestError = requests.error;
  const { data: settings } = await admin.db
    .from("website_settings")
    .select("*")
    .eq("id", true)
    .single();
  const { data: content } = await admin.db
    .from("website_content")
    .select("id,title,slug,published,kind")
    .order("created_at", { ascending: false });
  return (
    <div className="container admin-wrap admin-shell">
      <aside className="admin-nav">
        <small>WEBSITE OWNER</small>
        {[
          ["Team access", "team"],
          ["Dashboard", "dashboard"],
          ["Service requests", "service-requests"],
          ["Blog & content", "website"],
          ["Projects", "projects"],
          ["Scheduling", "settings/scheduling"],
          ["Business", "settings/business"],
          ["AI information", "ai"],
          ["Integrations", "settings/integrations"],
        ].map(([t, p]) => (
          <Link key={p} href={"/admin/" + p}>
            {t}
          </Link>
        ))}
        <form action={logout}>
          <button className="button small" style={{ marginTop: 20 }}>
            Sign out
          </button>
        </form>
      </aside>
      <section className="admin-main">
        <span className="eyebrow">PACIFIC PLAINS ELECTRIC</span>
        <h1>
          {path
            .split("/")
            .at(-1)
            ?.replaceAll("-", " ")
            .replace(/^./, (x) => x.toUpperCase())}
        </h1>
        {path === "team" && (
          <TeamAccess
            members={members || []}
            role={admin.role}
            email={admin.user.email || ""}
          />
        )}{" "}
        {path === "dashboard" && (
          <>
            <p>
              Your website’s content and customer inquiries. Operational
              workflows belong in Volteira.
            </p>
            <div className="metric-grid">
              <div className="metric">
                New requests awaiting review
                <strong>
                  {requestError ? "Unavailable" : statusCounts(requests.rows).new}
                </strong>
              </div>
              <div className="metric">
                Online scheduling<strong>OFF</strong>
              </div>
              <div className="metric">
                Volteira connection<strong>Not connected</strong>
              </div>
            </div>
            <div className="panel">
              <h2>What’s ready</h2>
              <p>
                Public pages, service-request intake, content publishing, and
                scheduling preferences.
              </p>
              <p>
                Appointments, estimates, invoices, jobs, and live AI require the
                operational Volteira integration. No sample operational numbers
                are shown here.
              </p>
              <Link className="text-link" href="/admin/service-requests">
                Track service requests by reference number ↗
              </Link>
            </div>
          </>
        )}
        {path === "service-requests" && (
          <>
            <div className="notice">
              Every request submitted on the website, newest first, with the
              reference number the customer was shown. These are not confirmed
              appointments; contact customers to arrange the work.
            </div>
            {requestError ? (
              <p>Requests could not be loaded. Try again.</p>
            ) : (
              <RequestTracker
                rows={requests.rows}
                params={parseTrackerParams(await searchParams)}
                truncated={requests.truncated}
              />
            )}
          </>
        )}
        {path === "settings/scheduling" && (
          <Scheduling initial={settings?.scheduling || {}} />
        )}
        {["website", "blog", "projects"].includes(path) && (
          <>
            <div className="panel" style={{ marginBottom: 24 }}>
              <h2>Content library</h2>
              {content?.length ? (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.map((c) => (
                        <tr key={c.id}>
                          <td>{c.title}</td>
                          <td>{c.slug}</td>
                          <td>{c.published ? "Published" : "Draft"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>
                  No custom entries yet. The starter planning articles are
                  included in the website source.
                </p>
              )}
            </div>
            <ContentEditor />
          </>
        )}
        {path === "settings/business" && (
          <div className="panel">
            <h2>Business details</h2>
            <p>
              {business.name}
              <br />
              Owner: {business.owner}
              <br />
              {business.license}
              <br />
              {business.workPhone.display}
              <br />
              {business.email}
              <br />
              {business.serviceArea}
              <br />
              Diagnostic: ${business.diagnosticPrice}. {diagnosticTerms}
              <br />
              Timezone: {business.timezone}
            </p>
            <div className="notice">
              These initial verified details are centralized in the website
              configuration. Live business-setting changes require the Volteira
              business-profile adapter so phone, website, and operations stay
              consistent.
            </div>
          </div>
        )}
        {path === "ai" && (
          <div className="panel">
            <h2>Website assistant</h2>
            <p>
              There is no live website chat assistant. The automated phone
              assistant is managed separately; its pricing answers must follow
              the policy below.
            </p>
            <p>
              Approved diagnostic price: ${business.diagnosticPrice}.{" "}
              {diagnosticTerms} Human escalation: {business.email}. It must not
              invent availability, pricing, or provide electrical DIY
              troubleshooting.
            </p>
            <div className="notice">
              AI conversations and knowledge will be managed through Volteira
              when its authenticated API is available.
            </div>
          </div>
        )}
        {path === "settings/integrations" && (
          <div className="panel">
            <h2>Connection status</h2>
            <p>
              Website database: connected to the separate Pacific Plains
              Electric Supabase project.
            </p>
            <p>
              Volteira: not connected.
              <br />
              Email and SMS delivery: not connected.
              <br />
              Payments: not enabled.
              <br />
              Photo uploads: not enabled.
            </p>
            <p>
              Service requests are persisted here. No automatic delivery or
              appointment booking is claimed.
            </p>
          </div>
        )}
        {path === "settings" && (
          <div className="panel">
            <Link className="text-link" href="/admin/settings/scheduling">
              Scheduling preferences ↗
            </Link>
            <br />
            <Link className="text-link" href="/admin/settings/business">
              Business information ↗
            </Link>
          </div>
        )}
        {![
          "team",
          "dashboard",
          "service-requests",
          "website",
          "blog",
          "projects",
          "settings/scheduling",
          "settings/business",
          "ai",
          "settings/integrations",
          "settings",
        ].includes(path) && (
          <div className="panel">
            <h2>Managed through Volteira.</h2>
            <p>
              This operational section is not connected yet. The website will
              display authorized Volteira data here when the integration is
              available.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
