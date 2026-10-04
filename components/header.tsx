"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Sun, Moon } from "lucide-react";
import Brand from "./brand";
import { business } from "@/config/business";
export const navigation = [
  ["Services", "/services"],
  ["About", "/about"],
  ["Guides", "/blog"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
] as const;
export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const current = (url: string) => (path.startsWith(url) ? "page" : undefined);
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
        <Brand />
        <nav
          aria-label="Main navigation"
          id="main-navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              document.getElementById("navigation-toggle")?.focus();
            }
          }}
          className={open ? "nav open" : "nav"}
        >
          {navigation.map(([label, url]) => (
            <Link
              key={url}
              href={url}
              onClick={() => setOpen(false)}
              aria-current={current(url)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/services"
            className="header-services"
            onClick={() => setOpen(false)}
            aria-current={current("/services")}
          >
            Services
          </Link>
          <a href={business.workPhone.tel} className="header-phone">
            <Phone size={18} aria-hidden="true" />
            <span>{business.workPhone.display}</span>
          </a>
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
          >
            <Sun className="sun" size={19} />
            <Moon className="moon" size={18} />
          </button>
          <Link className="button small header-cta" href="/request-service">
            Online form
          </Link>
          <button
            id="navigation-toggle"
            type="button"
            aria-controls="main-navigation"
            className="mobile-menu icon-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
