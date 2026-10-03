import { NextResponse } from "next/server";
import { sessionDb } from "@/lib/auth/server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const db = await sessionDb();
    const result = await db?.auth.exchangeCodeForSession(code);
    if (result && !result.error)
      return NextResponse.redirect(new URL("/admin", url.origin));
  }
  return NextResponse.redirect(
    new URL("/admin?verification=check-email", url.origin),
  );
}
