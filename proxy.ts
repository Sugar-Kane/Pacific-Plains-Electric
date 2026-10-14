import { hasSpanish, preferredLanguage, spanishPath } from "@/lib/i18n/shared";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) {
    const spanish = path === "/es" || path.startsWith("/es/");
    const explicit = request.nextUrl.searchParams.get("lang");
    const saved = explicit === "en" || explicit === "es" ? explicit : request.cookies.get("ppe-language")?.value;
    // Explicit localized URLs always work. Only negotiate normal page visits,
    // never API calls, crawlers, prefetches, or authentication/appointment links.
    const language = saved === "en" || saved === "es" ? saved : preferredLanguage(request.headers.get("accept-language"));
    if (!spanish && hasSpanish(path) && language === "es" && request.method === "GET"
      && !request.headers.has("next-router-prefetch") && !request.headers.has("rsc")
      && !/bot|crawler|spider/i.test(request.headers.get("user-agent") || "")) {
      const url = request.nextUrl.clone(); url.pathname = spanishPath(path);
      const redirect = NextResponse.redirect(url, 307);
      redirect.headers.set("Cache-Control", "private, no-store");
      redirect.headers.set("Vary", "Accept-Language, Cookie");
      return redirect;
    }
    const headers = new Headers(request.headers);
    headers.set("x-ppe-language", spanish ? "es" : "en");
    const localized = NextResponse.next({ request: { headers } });
    if (explicit === "en" || explicit === "es") localized.cookies.set("ppe-language", explicit, { path: "/", maxAge: 31536000, sameSite: "lax", secure: request.nextUrl.protocol === "https:" });
    return localized;
  }
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const db = createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  await db.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/((?!api|_next|auth|appointment|.*\\.).*)"] };
