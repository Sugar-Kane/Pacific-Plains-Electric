"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { intakeCategories, intakeServiceName } from "@/config/intake";
import { coverageMessage } from "@/config/coverage";
import { business, diagnosticTerms, smsDisclosure } from "@/config/business";

export default function RequestForm({
  initialService,
}: {
  initialService: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [location, setLocation] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    service: initialService,
    contactMethod: "phone",
  });
  const [sms, setSms] = useState(false);
  const [consent, setConsent] = useState(false);
  // Keep the same key and payload after uncertain network failures. An explicit
  // rejection permits editing; an uncertain outcome offers an exact safe retry.
  const attempt = useRef<{
    key: string;
    payload: Record<string, unknown>;
  } | null>(null);
  const sending = useRef(false);
  const [uncertain, setUncertain] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (done) resultHeading.current?.focus();
  }, [done]);
  useEffect(() => {
    if (error) errorBox.current?.focus();
  }, [error]);
  const update = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));
  async function submit() {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    if (!attempt.current) {
      const trimmed = location.trim();
      const isZip = /^\d{5}(?:-\d{4})?$/.test(trimmed);
      attempt.current = {
        key: crypto.randomUUID(),
        payload: {
          ...values,
          firstName: values.firstName?.trim(),
          lastName: "",
          email: values.email || "",
          address: "",
          city: isZip ? "" : trimmed,
          postalCode: isZip ? trimmed : "",
          description: values.description || "",
          preferredTimes: values.preferredTimes || "",
          website: values.website || "",
          smsConsent: sms,
          transactionalConsent: consent,
        },
      };
    }
    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...attempt.current.payload,
          idempotencyKey: attempt.current.key,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) {
        // Validation errors cannot have created a request. Server failures may
        // occur after saving, so retain the exact attempt for a safe retry.
        if ([400, 403, 413, 415, 422, 429].includes(response.status))
          attempt.current = null;
        throw new Error(
          result.error ||
            "We couldn’t confirm your request. Please retry or call us.",
        );
      }
      if (
        result.status !== "received" ||
        typeof result.reference !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(result.reference)
      ) {
        throw new Error(
          "We couldn’t confirm your request. Please retry or call us.",
        );
      }
      setDone(result.reference);
    } catch (e) {
      setUncertain(!!attempt.current);
      setError(
        e instanceof Error &&
          e.name !== "TimeoutError" &&
          e.name !== "TypeError"
          ? e.message
          : "We couldn’t confirm your request. Check your connection, then retry or call us.",
      );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="panel">
        <CheckCircle size={40} className="success-icon" aria-hidden="true" />
        <h2 ref={resultHeading} tabIndex={-1}>
          Your request has been received
        </h2>
        <p>
          Thank you for contacting Pacific Plains Electric. We’ll contact you to
          discuss your electrical needs and confirm the next steps.
        </p>
        <p>
          <strong>This is not a confirmed appointment.</strong>
        </p>
        <div className="notice">
          Reference: <strong>{done.slice(0, 8).toUpperCase()}</strong>
        </div>
        <p>{diagnosticTerms}</p>
        <a className="button" href={business.workPhone.tel}>
          <Phone size={17} aria-hidden="true" /> Call{" "}
          {business.workPhone.display}
        </a>
        <p>
          <Link className="text-link" href="/">
            Back to home
          </Link>
        </p>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      aria-busy={busy}
    >
      <p className="required-note">
        Fields marked * are required. No account or payment needed.
      </p>
      {error && (
        <div className="notice error" role="alert" tabIndex={-1} ref={errorBox}>
          <p>{error}</p>
          {uncertain && (
            <p>
              Your details are kept below. Retry sends the same request to
              prevent duplicates. To change details while its status is
              uncertain, please call.
            </p>
          )}
          <a className="text-link" href={business.workPhone.tel}>
            Call {business.workPhone.display}
          </a>
        </div>
      )}
      <fieldset className="intake-fields" disabled={busy || uncertain}>
        <legend className="sr-only">Service request details</legend>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="service">What do you need help with? *</label>
            <select
              id="service"
              name="service"
              value={values.service}
              onChange={(e) => update("service", e.target.value)}
              required
            >
              {!intakeCategories.some((s) => s.slug === initialService) && (
                <option value={initialService}>
                  {intakeServiceName(initialService)}
                </option>
              )}
              {intakeCategories.map((s) => (
                <option value={s.slug} key={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field full">
            <label htmlFor="description">
              Tell us what’s happening (optional)
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={2000}
              value={values.description || ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="For example, two outlets in my kitchen stopped working."
              aria-describedby="description-help"
            />
            <small id="description-help">
              Please don’t include payment information or access codes.
            </small>
          </div>
          <div className="form-field">
            <label htmlFor="firstName">Your name *</label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="name"
              required
              maxLength={80}
              value={values.firstName || ""}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              minLength={10}
              maxLength={25}
              value={values.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div className="form-field full">
            <label htmlFor="location">City or ZIP code *</label>
            <input
              id="location"
              name="location"
              autoComplete="address-level2"
              required
              minLength={2}
              maxLength={80}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-describedby="coverage-note"
            />
            <small id="coverage-note" role="status">
              {coverageMessage(location)}
            </small>
          </div>
        </div>
        <details className="optional-details">
          <summary>Add email or preferred contact times (optional)</summary>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={values.email || ""}
                onChange={(e) => {
                  update("email", e.target.value);
                  if (!e.target.value) update("contactMethod", "phone");
                }}
              />
            </div>
            <div className="form-field full">
              <label htmlFor="preferredTimes">
                Preferred days or times (optional)
              </label>
              <input
                id="preferredTimes"
                maxLength={300}
                value={values.preferredTimes || ""}
                onChange={(e) => update("preferredTimes", e.target.value)}
                placeholder="For example, weekday mornings"
              />
              <small>
                We’ll confirm a time with you. This is not a reservation.
              </small>
            </div>
            <div className="form-field full">
              <label htmlFor="contactMethod">Preferred contact method</label>
              <select
                id="contactMethod"
                value={values.contactMethod}
                onChange={(e) => update("contactMethod", e.target.value)}
              >
                <option value="phone">Phone call</option>
                {values.email && <option value="email">Email</option>}
              </select>
            </div>
          </div>
        </details>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website || ""}
            onChange={(e) => update("website", e.target.value)}
          />
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
      </fieldset>
      <p className="notice">
        $180 diagnostic visit. {diagnosticTerms} No payment is collected here.
      </p>
      <button className="button" type="submit" disabled={busy}>
        {busy ? "Sending…" : uncertain ? "Retry My Request" : "Send My Request"}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
