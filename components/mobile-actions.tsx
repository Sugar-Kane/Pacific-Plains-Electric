"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { business } from "@/config/business";
export default function MobileActions({ spanish = false }: { spanish?: boolean }) {
  const requesting = usePathname().endsWith("/request-service");
  return (
    <div className={`mobile-action-bar${requesting ? " mobile-help-bar" : ""}`} role="group" aria-label={spanish ? "Contactar a Pacific Plains Electric" : "Contact Pacific Plains Electric"}>
      <a href={business.workPhone.tel}><Phone size={17} aria-hidden="true" /> {spanish ? "Llamar" : "Call"}</a>
      <a href={business.workPhone.sms}><MessageSquare size={17} aria-hidden="true" /> {spanish ? "Mensaje" : "Text"}</a>
      {!requesting && <Link className="mobile-request" href={spanish ? "/es/request-service" : "/request-service"}>{spanish ? "Solicitar servicio" : "Request Service"}</Link>}
    </div>
  );
}
