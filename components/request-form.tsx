"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ArrowLeft, Phone } from "lucide-react";
import { requestableServices as services } from "@/config/content";
import { business, smsDisclosure } from "@/config/business";
export default function RequestForm({
  initialService,
}: {
  initialService: string;
}) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    service: initialService || "troubleshooting",
    contactMethod: "phone",
  });
  const [sms, setSms] = useState(false);
  const [consent, setConsent] = useState(false);
  const key = useRef("");
  const form = useRef<HTMLFormElement>(null);
  function field(
    label: string,
    name: string,
    type = "text",
    autoComplete?: string,
  ) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label} *</label>
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          maxLength={name === "email" ? 254 : 200}
          value={values[name] || ""}
          onChange={(e) => setValues({ ...values, [name]: e.target.value })}
        />
      </div>
    );
  }
  async function submit() {
    setBusy(true);
    setError("");
    if (!key.current) key.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          idempotencyKey: key.current,
          preferredTimes: values.preferredTimes || "",
          website: values.website || "",
          smsConsent: sms,
          transactionalConsent: consent,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to save your request.");
      setDone(result.reference);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="panel">
        <CheckCircle
          size={40}
          className="success-icon" aria-hidden="true" />
        <h2>Your request is saved.</h2>
        <p>
          We’ve received your details for review.{" "}
          <strong>This is not a confirmed appointment.</strong>
        </p>
        <p>
          Keep the reference below for your records. For a time-sensitive
          request, please call.
        </p>
        <div className="notice">
          Reference: <strong>{done.slice(0, 8).toUpperCase()}</strong>
        </div>
        <a className="button" href={business.workPhone.tel}>
          <Phone size={17} aria-hidden="true" /> Call {business.workPhone.display}
        </a>
        <p>
          <Link className="text-link" href="/">Back to home</Link>
        </p>
      </div>
    );
  return (
    <div>
      <ol className="form-steps">
        <li className={step === 1 ? "active" : ""} aria-current={step === 1 ? "step" : undefined}>
          <b>1</b>Details
        </li>
        <li className={step === 2 ? "active" : ""} aria-current={step === 2 ? "step" : undefined}>
          <b>2</b>Review
        </li>
        <li>
          <b>3</b>Sent
        </li>
      </ol>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          setStep(2);
        }}
        style={{ display: step === 1 ? "block" : "none" }}
      >
        <p className="required-note">
          Fields marked * are required. No account or payment needed.
        </p>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="service">What can we help with? *</label>
            <select
              id="service"
              required
              value={values.service}
              onChange={(e) =>
                setValues({ ...values, service: e.target.value })
              }
            >
              {services.map((s) => (
                <option value={s.slug} key={s.slug}>
                  {s.name}
                          {s.slug === "troubleshooting"
                    ? ` · $${business.diagnosticPrice} diagnostic`
                    : ""}
                </option>
              ))}
            </select>
          </div>
          {field("First name", "firstName", "text", "given-name")}
          {field("Last name", "lastName", "text", "family-name")}
          {field("Phone", "phone", "tel", "tel")}
          {field("Email", "email", "email", "email")}
          <div className="form-field full">
            <label htmlFor="address">Service address *</label>
            <input
              id="address"
              autoComplete="street-address"
              required
              minLength={5}
              maxLength={200}
              value={values.address || ""}
              onChange={(e) =>
                setValues({ ...values, address: e.target.value })
              }
            />
          </div>
          {field("City", "city", "text", "address-level2")}
          <div className="form-field">
            <label htmlFor="postalCode">California ZIP code *</label>
            <input
              id="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]{5}(-[0-9]{4})?"
              required
              maxLength={10}
              value={values.postalCode || ""}
              onChange={(e) =>
                setValues({ ...values, postalCode: e.target.value })
              }
            />
          </div>
          <div className="form-field full">
            <label htmlFor="description">Tell us what’s going on *</label>
            <textarea
              id="description"
              required
              minLength={10}
              maxLength={2000}
              placeholder="Describe the issue or your plans for the project."
              value={values.description || ""}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
            <small>
              Please do not include payment information or access codes.
            </small>
          </div>
          <div className="form-field full">
            <label htmlFor="preferredTimes">Preferred days or times</label>
            <input
              id="preferredTimes"
              maxLength={300}
              placeholder="For example, weekday mornings"
              value={values.preferredTimes || ""}
              onChange={(e) =>
                setValues({ ...values, preferredTimes: e.target.value })
              }
            />
            <small>
              Preferences are not a reservation. Times will be coordinated with
              you.
            </small>
          </div>
          <div className="form-field full">
            <label htmlFor="contactMethod">Preferred contact method</label>
            <select
              id="contactMethod"
              value={values.contactMethod}
              onChange={(e) =>
                setValues({ ...values, contactMethod: e.target.value })
              }
            >
              <option value="phone">Phone call</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website || ""}
              onChange={(e) =>
                setValues({ ...values, website: e.target.value })
              }
            />
          </div>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            I agree to be contacted about this service request and have read the{" "}
            <Link href="/privacy" target="_blank">
              Privacy Notice
            </Link>{" "}
            and{" "}
            <Link href="/terms" target="_blank">
              Website Terms
            </Link>
            . I understand this is not a confirmed appointment. *
          </span>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={sms}
            onChange={(e) => setSms(e.target.checked)}
          />
          <span>{smsDisclosure}</span>
        </label>
        <button className="button" type="submit">
          Review request <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
      {step === 2 && (
        <div className="panel">
          <h2>Check the details.</h2>
          <p>
            No appointment or charge will be created by sending this request.
          </p>
          <dl>
            {[
              [
                "Service",
                services.find((s) => s.slug === values.service)?.name,
              ],
              ["Name", values.firstName + " " + values.lastName],
              ["Phone", values.phone],
              ["Email", values.email],
              [
                "Address",
                values.address +
                  ", " +
                  values.city +
                  ", CA " +
                  values.postalCode,
              ],
              ["Description", values.description],
              ["Preferences", values.preferredTimes || "None specified"],
              ["Contact", values.contactMethod],
              ["SMS consent", sms ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div className="review-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="legal-note">
            ${business.diagnosticPrice} diagnostic visit; repairs quoted
            separately. No payment is collected here.
          </p>
          <div className="actions">
            <button
              className="button outline"
              onClick={() => {
                setStep(1);
                key.current = "";
              }}
              disabled={busy}
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Edit
            </button>
            <button className="button" onClick={submit} disabled={busy}>
              {busy ? "Sending…" : "Send service request"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
