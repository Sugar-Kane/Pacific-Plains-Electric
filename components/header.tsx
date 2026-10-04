"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Sun, Moon, ArrowUpRight } from "lucide-react";
import Brand from "./brand";
import { business } from "@/config/business";
export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  function toggleTheme() {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("ppe-theme", dark ? "dark" : "light");
    } catch {}
  }
  return (
    <>
      <div className="topline">
        <span>SAN LUIS OBISPO COUNTY</span>
        <span>California licensed · {business.license}</span>
      </div>
      <header className="header">
        <div className="header-inner">
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
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, url]) => (
              <Link
                key={url}
                href={url}
                onClick={() => setOpen(false)}
                aria-current={
                  (url === "/" ? path === url : path.startsWith(url))
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/services" className="button small services-shortcut" onClick={() => setOpen(false)} aria-current={path.startsWith("/services") ? "page" : undefined}>Services</Link>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle light and dark theme"
            >
              <Sun className="sun" size={17} />
              <Moon className="moon" size={16} />
            </button>
            <a href={business.workPhone.tel} className="header-phone">
              <Phone size={19} />
              <span>
                <strong>{business.workPhone.display}</strong>
                <small>Service inquiries</small>
              </span>
            </a>
            <Link className="button small header-cta" href="/request-service">
              Online Form <ArrowUpRight size={16} />
            </Link>
            <button
              id="navigation-toggle"
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
    </>
  );
}
