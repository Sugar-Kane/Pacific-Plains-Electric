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
        <span>LOCAL EXPERTISE. CENTRAL COAST ROOTS.</span>
        <span>California licensed · {business.license}</span>
      </div>
      <header className="header">
        <div className="header-inner">
          <Brand />
          <nav
            aria-label="Main navigation"
            className={open ? "nav open" : "nav"}
          >
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["About", "/about"],
              ["Projects", "/projects"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, url]) => (
              <Link
                key={url}
                href={url}
                onClick={() => setOpen(false)}
                aria-current={path === url ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
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
                <small>24/7 AI Assistant</small>
              </span>
            </a>
            <Link className="button small header-cta" href="/request-service">
              Request Service <ArrowUpRight size={16} />
            </Link>
            <button
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
