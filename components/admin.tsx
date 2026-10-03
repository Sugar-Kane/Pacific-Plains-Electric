"use client";
import { useActionState, useState } from "react";
import {
  login,
  saveScheduling,
  enableScheduling,
  saveContent,
  registerOwner,
  addMember,
  changeMember,
} from "@/app/admin/actions";
import { days } from "@/config/business";
export function Login() {
  const [create, setCreate] = useState(false);
  const [registration, registerAction, registerPending] = useActionState(
    registerOwner,
    {},
  );
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <div>
      <form
        action={create ? registerAction : action}
        className="panel auth-panel"
      >
        <span className="eyebrow">OWNER ACCESS</span>
        <h2>{create ? "Create your account." : "Welcome back."}</h2>
        <p>
          {create
            ? "Use an email address that has been granted website access. Verify your email before signing in."
            : "Sign in with your website administrator account."}
        </p>
        {registration.error && (
          <div className="notice error" role="alert">
            {registration.error}
          </div>
        )}
        {registration.success && (
          <div className="notice success" role="status">
            {registration.success}
          </div>
        )}
        {state.error && (
          <div role="alert" className="notice error">
            {state.error}
          </div>
        )}
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </div>
          <div className="form-field full">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={create ? 12 : 8}
              required
            />
          </div>
        </div>
        <button
          className="button"
          style={{ marginTop: 22 }}
          disabled={pending || registerPending}
        >
          {pending || registerPending
            ? "Please wait…"
            : create
              ? "Create account"
              : "Sign in"}
        </button>
        <p className="legal-note" style={{ marginTop: 20 }}>
          There are no default passwords. Account creation alone does not grant
          access.
        </p>
        <button
          type="button"
          className="text-link"
          style={{ background: "transparent", border: 0 }}
          onClick={() => setCreate(!create)}
        >
          {create
            ? "Already registered? Sign in"
            : "First time? Create your account"}
        </button>
      </form>
    </div>
  );
}
export type ScheduleConfig = {
  days: { enabled: boolean; start: string; end: string }[];
  durationMinutes: number;
  travelBufferMinutes: number;
  minimumNoticeHours: number;
  maxAdvanceDays: number;
  sameDay: boolean;
};
export function Scheduling({ initial }: { initial: Partial<ScheduleConfig> }) {
  const [config, setConfig] = useState<ScheduleConfig>({
    days:
      initial.days ||
      days.map(() => ({ enabled: false, start: "07:00", end: "17:00" })),
    durationMinutes: initial.durationMinutes || 60,
    travelBufferMinutes: initial.travelBufferMinutes ?? 30,
    minimumNoticeHours: initial.minimumNoticeHours ?? 24,
    maxAdvanceDays: initial.maxAdvanceDays || 30,
    sameDay: initial.sameDay || false,
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="panel">
      <h2>
        Online scheduling <span className="badge">OFF</span>
      </h2>
      <p>
        Customers cannot currently book appointments directly through the
        website.
      </p>
      <div className="notice">
        Configure preferences here. Live availability, atomic booking,
        appointment management, and the Volteira connection must be verified
        before enabling bookings.
      </div>
      <h3>Working days & hours</h3>
      <p>
        America/Los_Angeles · Pacific time, with daylight saving changes handled
        automatically.
      </p>
      <div className="settings-days">
        {days.map((day, i) => (
          <div className="day-row" key={day}>
            <label>
              <input
                type="checkbox"
                checked={config.days[i].enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    days: config.days.map((d, j) =>
                      j === i ? { ...d, enabled: e.target.checked } : d,
                    ),
                  })
                }
              />{" "}
              {day}
            </label>
            <input
              aria-label={day + " start time"}
              type="time"
              disabled={!config.days[i].enabled}
              value={config.days[i].start}
              onChange={(e) =>
                setConfig({
                  ...config,
                  days: config.days.map((d, j) =>
                    i === j ? { ...d, start: e.target.value } : d,
                  ),
                })
              }
            />
            <input
              aria-label={day + " end time"}
              type="time"
              disabled={!config.days[i].enabled}
              value={config.days[i].end}
              onChange={(e) =>
                setConfig({
                  ...config,
                  days: config.days.map((d, j) =>
                    i === j ? { ...d, end: e.target.value } : d,
                  ),
                })
              }
            />
          </div>
        ))}
      </div>
      <div className="form-grid">
        {(
          [
            ["durationMinutes", "Appointment duration (minutes)", 15, 480],
            ["travelBufferMinutes", "Travel buffer (minutes)", 0, 180],
            ["minimumNoticeHours", "Minimum notice (hours)", 0, 720],
            ["maxAdvanceDays", "Booking window (days)", 1, 365],
          ] as const
        ).map(([name, label, min, max]) => (
          <div className="form-field" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type="number"
              min={min}
              max={max}
              value={config[name]}
              onChange={(e) =>
                setConfig({ ...config, [name]: Number(e.target.value) })
              }
            />
          </div>
        ))}
      </div>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={config.sameDay}
          onChange={(e) => setConfig({ ...config, sameDay: e.target.checked })}
        />
        Allow same-day appointments when the live provider supports them
      </label>
      <div className="actions">
        <button
          className="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const r = await saveScheduling(config);
            setMessage(r.error || r.success || "");
            setBusy(false);
          }}
        >
          {busy ? "Saving…" : "Save preferences"}
        </button>
        <button
          className="button outline"
          onClick={async () => {
            const r = await enableScheduling();
            setMessage(r.error);
          }}
        >
          Enable online scheduling
        </button>
      </div>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
    </section>
  );
}
export function ContentEditor() {
  const [state, action, pending] = useActionState(saveContent, { error: "" });
  return (
    <form action={action} className="panel">
      <h2>Write or update content</h2>
      <p>
        Use an existing slug to update that entry. Text is rendered safely as
        plain text.
      </p>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="kind">Content type</label>
          <select name="kind" id="kind">
            <option value="article">Blog article</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="slug">Slug</label>
          <input
            name="slug"
            id="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={100}
          />
        </div>
        <div className="form-field full">
          <label htmlFor="title">Title</label>
          <input name="title" id="title" required maxLength={160} />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <input name="category" id="category" maxLength={60} />
        </div>
        <div className="form-field">
          <label htmlFor="excerpt">Short introduction</label>
          <input name="excerpt" id="excerpt" maxLength={350} />
        </div>
        <div className="form-field full">
          <label htmlFor="body">Article or project text</label>
          <textarea
            name="body"
            id="body"
            required
            maxLength={30000}
            rows={12}
          />
        </div>
        <div className="form-field">
          <label htmlFor="seo_title">SEO title · up to 70 characters</label>
          <input name="seo_title" id="seo_title" maxLength={70} />
        </div>
        <div className="form-field">
          <label htmlFor="seo_description">
            Meta description · up to 170 characters
          </label>
          <input name="seo_description" id="seo_description" maxLength={170} />
        </div>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="published" />
        Publish now. Leave unchecked to save a private draft.
      </label>
      <p className="legal-note">
        Publish only approved factual content. Do not include customer addresses
        or private information. Project images and verified reviews require a
        separate content review.
      </p>
      <button className="button" disabled={pending}>
        {pending ? "Saving…" : "Save content"}
      </button>
      {state.error && (
        <div className="notice error" role="alert">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="notice success" role="status">
          {state.success}
        </div>
      )}
    </form>
  );
}

export function TeamAccess({
  members,
  role,
  email,
}: {
  members: { email: string; role: string }[];
  role: "OWNER" | "ADMIN";
  email: string;
}) {
  const [state, action, pending] = useActionState(addMember, {});
  const [changed, change, pendingChange] = useActionState(changeMember, {});
  return (
    <>
      <div className="panel">
        <h2>Team access</h2>
        <p>
          Owners manage ownership. Admins can add or change admins and
          technicians. Technicians are reserved for a future operational
          integration and have no access to this website’s admin area.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.email}>
                  <td>
                    {m.email}
                    {m.email === email ? " (you)" : ""}
                  </td>
                  <td>{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <form action={action} className="panel" style={{ marginTop: 24 }}>
        <h2>Add access</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="member-email">Email</label>
            <input type="email" id="member-email" name="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="member-role">Role</label>
            <select name="role" id="member-role">
              <option value="ADMIN">Admin</option>
              <option value="TECHNICIAN">Technician (reserved)</option>
              {role === "OWNER" && <option value="OWNER">Owner</option>}
            </select>
          </div>
        </div>
        <p className="legal-note">
          This grants access but does not send an email. The person must create
          an account at /admin and verify this email.
        </p>
        <button className="button" disabled={pending}>
          Add access
        </button>
        {state.error && (
          <div className="notice error" role="alert">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="notice success" role="status">
            {state.success}
          </div>
        )}
      </form>
      <form action={change} className="panel" style={{ marginTop: 24 }}>
        <h2>Change or remove access</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="change-email">Team member</label>
            <select id="change-email" name="email" required>
              <option value="">Select a person</option>
              {members
                .filter(
                  (m) =>
                    m.email !== email &&
                    (role === "OWNER" || m.role !== "OWNER"),
                )
                .map((m) => (
                  <option key={m.email}>{m.email}</option>
                ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="change-role">New access</label>
            <select id="change-role" name="role">
              <option value="ADMIN">Admin</option>
              <option value="TECHNICIAN">Technician (reserved)</option>
              {role === "OWNER" && <option value="OWNER">Owner</option>}
              <option value="REMOVE">Remove access</option>
            </select>
          </div>
        </div>
        <button
          className="button outline"
          style={{ marginTop: 20 }}
          disabled={pendingChange}
        >
          Update access
        </button>
        {changed.error && (
          <div className="notice error" role="alert">
            {changed.error}
          </div>
        )}
        {changed.success && (
          <div className="notice success" role="status">
            {changed.success}
          </div>
        )}
      </form>
    </>
  );
}
