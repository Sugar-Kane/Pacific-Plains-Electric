"use client";
import { diagnosticEs, smsEs, serviceNamesEs } from "@/lib/i18n/shared";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { intakeCategories, intakeServiceName } from "@/config/intake";
import { coverageMessage } from "@/config/coverage";
import { business, diagnosticTerms, smsDisclosure } from "@/config/business";

export default function RequestForm({
  initialService,
  spanish = false,
}: {
  initialService: string;
  spanish?: boolean;
}) {
  const t = (en: string, es: string) => spanish ? es : en;
  const terms = spanish ? diagnosticEs : diagnosticTerms;
  const disclosure = spanish ? smsEs : smsDisclosure;
  const local = (url: string) => spanish ? (url === "/" ? "/es" : "/es" + url) : url;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [textFollowUp, setTextFollowUp] = useState(false);
  const [location, setLocation] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    service: initialService,
    contactMethod: "text",
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
          preferredLanguage: spanish ? "es" : "en",
          firstName: values.firstName?.trim(),
          lastName: values.lastName?.trim(),
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
          (spanish ? (response.status === 422 ? "Si hay un peligro inmediato, aléjese y llame al 911. No toque equipos ni cables caídos. Para una consulta que no sea una emergencia, llámenos." : response.status === 429 ? "Hemos recibido varias solicitudes con estos datos. Llámenos para obtener ayuda." : response.status === 400 ? "Revise su nombre, teléfono, ciudad o código postal y las opciones de contacto y consentimiento." : "No pudimos confirmar su solicitud. Inténtelo de nuevo o llámenos.") : result.error) ||
            t("We couldn’t confirm your request. Please retry or call us.", "No pudimos confirmar su solicitud. Inténtelo de nuevo o llámenos."),
        );
      }
      if (
        result.status !== "received" ||
        typeof result.reference !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(result.reference)
      ) {
        throw new Error(
          t("We couldn’t confirm your request. Please retry or call us.", "No pudimos confirmar su solicitud. Inténtelo de nuevo o llámenos."),
        );
      }
      setTextFollowUp(result.textFollowUp === true);
      setDone(result.reference);
    } catch (e) {
      setUncertain(!!attempt.current);
      setError(
        e instanceof Error &&
          e.name !== "TimeoutError" &&
          e.name !== "TypeError"
          ? e.message
          : t("We couldn’t confirm your request. Check your connection, then retry or call us.", "No pudimos confirmar su solicitud. Revise su conexión y vuelva a intentarlo o llámenos."),
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
          {t("Your request has been received", "Hemos recibido su solicitud")}
        </h2>
        <p>
          {textFollowUp
            ? t("Thank you for contacting Pacific Plains Electric. We’ll text you in a moment to get a few details and find a time.", "Gracias por contactar a Pacific Plains Electric. Le enviaremos un mensaje para obtener algunos detalles y acordar un horario.")
            : t("Thank you for contacting Pacific Plains Electric. We’ll contact you to discuss your electrical needs and confirm the next steps.", "Gracias por contactar a Pacific Plains Electric. Nos comunicaremos con usted para hablar de sus necesidades eléctricas y confirmar los próximos pasos.")}
        </p>
        <p>
          <strong>{t("This is not a confirmed appointment.", "Esto no es una cita confirmada.")}</strong>
        </p>
        <div className="notice">
          {t("Reference:", "Referencia:")} <strong>{done.slice(0, 8).toUpperCase()}</strong>
        </div>
        <p>{terms}</p>
        <a className="button" href={business.workPhone.tel}>
          <Phone size={17} aria-hidden="true" /> {t("Call", "Llamar")}{" "}
          {business.workPhone.display}
        </a>
        <p>
          <Link className="text-link" href={local("/")}>
            {t("Back to home", "Volver al inicio")}
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
        {t("Fields marked * are required. No account or payment needed.", "Los campos con * son obligatorios. No necesita crear una cuenta ni pagar.")}
      </p>
      {error && (
        <div className="notice error" role="alert" tabIndex={-1} ref={errorBox}>
          <p>{error}</p>
          {uncertain && (
            <p>
              {t("Your details are kept below. Retry sends the same request to prevent duplicates. To change details while its status is uncertain, please call.", "Sus datos se conservan abajo. Al reintentar se envía la misma solicitud para evitar duplicados. Para cambiar los datos mientras no se confirme el estado, llámenos.")}
            </p>
          )}
          <a className="text-link" href={business.workPhone.tel}>
            {t("Call", "Llamar")} {business.workPhone.display}
          </a>
        </div>
      )}
      <fieldset className="intake-fields" disabled={busy || uncertain}>
        <legend className="sr-only">{t("Service request details", "Datos de la solicitud")}</legend>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="service">{t("What do you need help with? *", "¿Con qué necesita ayuda? *")}</label>
            <select
              id="service"
              name="service"
              value={values.service}
              onChange={(e) => update("service", e.target.value)}
              required
            >
              {!intakeCategories.some((s) => s.slug === initialService) && (
                <option value={initialService}>
                  {spanish ? serviceNamesEs[initialService] || serviceNamesEs.other : intakeServiceName(initialService)}
                </option>
              )}
              {intakeCategories.map((s) => (
                <option value={s.slug} key={s.slug}>
                  {spanish ? serviceNamesEs[s.slug] : s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field full">
            <label htmlFor="description">
              {t("Tell us what’s happening (optional)", "Cuéntenos qué sucede (opcional)")}
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={2000}
              value={values.description || ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder={t("For example, two outlets in my kitchen stopped working.", "Por ejemplo, dos tomacorrientes de mi cocina dejaron de funcionar.")}
              aria-describedby="description-help"
            />
            <small id="description-help">
              {t("Please don’t include payment information or access codes.", "No incluya datos de pago ni códigos de acceso.")}
            </small>
          </div>
          <div className="form-field">
            <label htmlFor="firstName">{t("First name *", "Nombre *")}</label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
              maxLength={80}
              value={values.firstName || ""}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">{t("Last name *", "Apellido *")}</label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
              maxLength={80}
              value={values.lastName || ""}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">{t("Phone number *", "Número de teléfono *")}</label>
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
          <div className="form-field">
            <label htmlFor="location">{t("City or ZIP code *", "Ciudad o código postal *")}</label>
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
              {coverageMessage(location, spanish)}
            </small>
          </div>
        </div>
            <div className="form-field full">
              <label htmlFor="contactMethod">{t("Preferred contact method", "Forma de contacto preferida")}</label>
              <select
                id="contactMethod"
                value={values.contactMethod}
                onChange={(e) => update("contactMethod", e.target.value)}
              >
                <option value="phone">{t("Phone call", "Llamada telefónica")}</option>
                <option value="text">{t("Text message", "Mensaje de texto")}</option>
                {values.email && <option value="email">{t("Email", "Correo electrónico")}</option>}
              </select>
            </div>
        <details className="optional-details">
          <summary>{t("Add email or preferred contact times (optional)", "Agregar correo electrónico u horario de contacto (opcional)")}</summary>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="email">{t("Email (optional)", "Correo electrónico (opcional)")}</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={values.email || ""}
                onChange={(e) => {
                  update("email", e.target.value);
                  if (!e.target.value && values.contactMethod === "email") update("contactMethod", "phone");
                }}
              />
            </div>
            <div className="form-field full">
              <label htmlFor="preferredTimes">
                {t("Preferred days or times (optional)", "Días u horarios preferidos (opcional)")}
              </label>
              <input
                id="preferredTimes"
                maxLength={300}
                value={values.preferredTimes || ""}
                onChange={(e) => update("preferredTimes", e.target.value)}
                placeholder={t("For example, weekday mornings", "Por ejemplo, por las mañanas entre semana")}
              />
              <small>
                {t("We’ll confirm a time with you. This is not a reservation.", "Confirmaremos un horario con usted. Esto no es una reserva.")}
              </small>
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
            {t("I agree to be contacted about this service request and have read the", "Acepto que me contacten sobre esta solicitud y he leído el")}{" "}
            <Link href={local("/privacy")} target="_blank" rel="noopener noreferrer" aria-label={t("Privacy Notice (opens in a new tab)", "Aviso de privacidad (se abre en otra pestaña)")}>
              {t("Privacy Notice", "Aviso de privacidad")}
            </Link>{" "}
            {t("and", "y los")}{" "}
            <Link href={local("/terms")} target="_blank" rel="noopener noreferrer" aria-label={t("Website Terms (opens in a new tab)", "Términos del sitio web (se abre en otra pestaña)")}>
              {t("Website Terms", "Términos del sitio web")}
            </Link>
            {t(". I understand this is not a confirmed appointment. *", ". Entiendo que esto no es una cita confirmada. *")}
          </span>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={sms}
            required={values.contactMethod === "text"}
            onChange={(e) => setSms(e.target.checked)}
          />
          <span>{disclosure}{values.contactMethod === "text" && t(" Select this consent to receive a text response, or choose Phone call instead.", " Marque este consentimiento para recibir una respuesta por texto, o elija una llamada telefónica.")}</span>
        </label>
      </fieldset>
      <p className="notice">
        {t("$180 diagnostic visit.", "Visita de diagnóstico de $180.")} {terms} {t("No payment is collected here.", "No se cobra ningún pago aquí.")}
      </p>
      <button className="button" type="submit" disabled={busy}>
        {busy ? t("Sending…", "Enviando…") : uncertain ? t("Retry My Request", "Reintentar mi solicitud") : t("Send My Request", "Enviar mi solicitud")}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
