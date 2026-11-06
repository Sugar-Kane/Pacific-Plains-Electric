"use client";
import { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { trackEvent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Where on the page a tapped link sits, so reports can compare placements. */
function placement(link: Element) {
  if (link.closest(".mobile-action-bar")) return "mobile_bar";
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  return "page";
}

/**
 * Vercel Web Analytics (cookieless page views) always; Google Analytics only
 * when NEXT_PUBLIC_GA_ID is set and the browser isn't sending a Global Privacy
 * Control signal. Google's ad features stay off.
 *
 * One document-level listener records taps on every call, text, email and
 * request-service link, wherever it is on the site, without wiring each one.
 * The site only sees the tap: whether a call or text then connects happens on
 * the visitor's phone and shows up in the phone line's call log instead.
 */
export default function Analytics() {
  useEffect(() => {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (!GA_ID || nav.globalPrivacyControl) return;
    window.dataLayer = window.dataLayer || [];
    // gtag.js reads the arguments object itself, so this can't be a rest parameter.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const params = { link_location: placement(link) };
      if (link.protocol === "tel:") trackEvent("call_click", params);
      else if (link.protocol === "sms:") trackEvent("text_click", params);
      else if (link.protocol === "mailto:") trackEvent("email_click", params);
      else if (
        link.origin === location.origin &&
        /^(\/es)?\/request-service\/?$/.test(link.pathname)
      )
        trackEvent("request_form_open", params);
    };
    // Capture phase, so taps still count if something else stops the event.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <VercelAnalytics />;
}
