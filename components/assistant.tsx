"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, X, Phone } from "lucide-react";
import { Mark } from "./brand";
import { business } from "@/config/business";
const answers: Record<string, string> = {
  pricing: `Diagnostic service is $${business.diagnosticPrice}. It covers professional troubleshooting and evaluation. Repairs and project work are additional. The fee is not automatically credited toward repairs.`,
  area: `We serve ${business.serviceArea}. Contact us to confirm your address.`,
  services:
    "We help with electrical repairs, troubleshooting, panel upgrades, EV chargers, lighting, new construction, and commercial electrical work.",
};
export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const close = useRef<HTMLButtonElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) close.current?.focus();
  }, [open]);
  function dismiss() {
    setOpen(false);
    launch.current?.focus();
  }
  return (
    <>
      <button
        ref={launch}
        className="chat-launcher"
        onClick={() => (open ? dismiss() : setOpen(true))}
        aria-expanded={open}
        aria-controls="ppe-assistant"
      >
        <MessageCircle size={20} />
        <span>Ask Pacific Plains</span>
      </button>
      {open && (
        <aside
          id="ppe-assistant"
          className="chat-panel"
          aria-label="Pacific Plains Electric assistant"
          onKeyDown={(e) => {
            if (e.key === "Escape") dismiss();
          }}
        >
          <div className="chat-header">
            <Mark />
            <div>
              <strong>Pacific Plains Electric</strong>
              <small>Service information</small>
            </div>
            <button ref={close} onClick={dismiss} aria-label="Close assistant">
              <X size={20} />
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-bubble">
              Hi! Find quick answers about services, diagnostic pricing, and how
              to request help.
            </div>
            <div className="chat-actions">
              <Link href="/request-service" onClick={dismiss}>
                Request service ↗
              </Link>
              <button onClick={() => setAnswer(answers.pricing)}>
                Diagnostic pricing
              </button>
              <button onClick={() => setAnswer(answers.services)}>
                Our services
              </button>
              <button onClick={() => setAnswer(answers.area)}>
                Service area
              </button>
              <a href={business.directPhone.tel}>
                Talk to Nicholas · {business.directPhone.display}
              </a>
            </div>
            {answer && (
              <div
                className="chat-bubble"
                style={{ marginTop: 15 }}
                role="status"
              >
                {answer}
              </div>
            )}
            <p className="chat-note">
              These are prepared answers. Live website AI chat is not connected
              yet. For the 24/7 AI phone assistant:
            </p>
            <a href={business.workPhone.tel} className="contact-item">
              <Phone size={17} />
              {business.workPhone.display}
            </a>
            <p className="chat-note">
              For fire, smoke, injury, or an immediate electrical hazard, move
              away and call 911. Do not touch downed wires. This website does
              not provide emergency dispatch.
            </p>
          </div>
        </aside>
      )}
    </>
  );
}
