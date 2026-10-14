"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Sun, Moon } from "lucide-react";
import LanguageSwitch from "./language-switch";
import Brand from "./brand";
import { business } from "@/config/business";
export const navigation = [
  ["Services", "/services"],
  ["About", "/about"],
  ["Service Area", "/service-areas"],
] as const;
export default function Header({ spanish = false }: { spanish?: boolean }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const local = (url: string) => spanish ? (url === "/" ? "/es" : "/es" + url) : url;
  const labels: Record<string, string> = { Services: "Servicios", About: "Nosotros", "Service Area": "Área de servicio" };
  const current = (url: string) => (path.startsWith(local(url)) ? "page" : undefined);
  function toggleTheme() {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("ppe-theme", dark ? "dark" : "light");
    } catch {}
  }
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand spanish={spanish} />
        <nav
          aria-label={spanish ? "Navegación principal" : "Main navigation"}
          id="main-navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              document.getElementById("navigation-toggle")?.focus();
            }
          }}
          className={open ? "nav open" : "nav"}
        >
          <Link
            className="mobile-nav-only"
            href={local("/")}
            onClick={() => setOpen(false)}
          >
            {spanish ? "Inicio" : "Home"}
          </Link>
          {navigation.map(([label, url]) => (
            <Link
              key={url}
              href={local(url)}
              onClick={() => setOpen(false)}
              aria-current={current(url)}
            >
              {spanish ? labels[label] : label}
            </Link>
          ))}
          <Link
            className="mobile-nav-only"
            href={local("/contact")}
            onClick={() => setOpen(false)}
          >
            {spanish ? "Contacto" : "Contact"}
          </Link>
        </nav>
        <div className="header-actions">
          <LanguageSwitch spanish={spanish} />
          <Link
            href={local("/services")}
            className="header-services"
            onClick={() => setOpen(false)}
            aria-current={current("/services")}
          >
            {spanish ? "Servicios" : "Services"}
          </Link>
          <a
            href={business.workPhone.tel}
            className="header-phone"
            aria-label={(spanish ? "Llamar " : "Call ") + business.workPhone.display}
          >
            <Phone size={18} aria-hidden="true" />
            <span>{spanish ? "Llamar" : "Call Now"}</span>
          </a>
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={spanish ? "Cambiar entre tema claro y oscuro" : "Toggle light and dark theme"}
          >
            <Sun className="sun" size={19} />
            <Moon className="moon" size={18} />
          </button>
          <Link className="button small header-cta" href={local("/request-service")}>
            {spanish ? "Solicitar servicio" : "Request Service"}
          </Link>
          <button
            id="navigation-toggle"
            type="button"
            aria-controls="main-navigation"
            className="mobile-menu icon-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? (spanish ? "Cerrar menú" : "Close navigation") : (spanish ? "Abrir menú" : "Open navigation")}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
