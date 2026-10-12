"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { business } from "@/config/business";
export default function MobileActions() {
  const requesting = usePathname() === "/request-service";
  return (
    <div className={`mobile-action-bar${requesting ? " mobile-help-bar" : ""}`} role="group" aria-label="Contact Pacific Plains Electric">
      <a href={business.workPhone.tel}><Phone size={17} aria-hidden="true" /> Call</a>
      <a href={business.workPhone.sms}><MessageSquare size={17} aria-hidden="true" /> Text</a>
      {!requesting && <Link className="mobile-request" href="/request-service">Request Service</Link>}
    </div>
  );
}
