"use client";
import { usePathname } from "next/navigation";
import { hasSpanish, spanishPath } from "@/lib/i18n/shared";
export default function LanguageSwitch({ spanish }: { spanish: boolean }) {
  const path = usePathname();
  const english = path.replace(/^\/es(?=\/|$)/, "") || "/";
  const target = spanish ? english : hasSpanish(path) ? spanishPath(path) : "/es";
  return <a className="language-switch" href={target + "?lang=" + (spanish ? "en" : "es")} lang={spanish ? "en" : "es"} hrefLang={spanish ? "en" : "es"}
    onClick={(event) => {
      document.cookie = `ppe-language=${spanish ? "en" : "es"}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      // Keep service preselection and other query parameters when changing language.
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        const query = new URLSearchParams(location.search);
        query.set("lang", spanish ? "en" : "es");
        location.assign(target + "?" + query.toString() + location.hash);
      }
    }}>{spanish ? "English" : "Español"}</a>;
}
