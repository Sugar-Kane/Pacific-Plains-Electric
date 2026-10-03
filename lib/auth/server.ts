import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (url, init) =>
        fetch(url, { ...init, signal: AbortSignal.timeout(10000) }),
    },
  });
}
export async function sessionDb() {
  const jar = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookies) {
        try {
          cookies.forEach(({ name, value, options }) =>
            jar.set(name, value, options),
          );
        } catch {
          /* A render cannot write cookies; actions refresh sessions. */
        }
      },
    },
  });
}
export async function getAdmin() {
  const db = await sessionDb();
  if (!db) return null;
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user || !user.email_confirmed_at) return null;
  const { data: role, error: roleError } = await db.rpc("current_website_role");
  if (roleError || !["OWNER", "ADMIN"].includes(role)) return null;
  return { db, user, role: role as "OWNER" | "ADMIN" };
}
