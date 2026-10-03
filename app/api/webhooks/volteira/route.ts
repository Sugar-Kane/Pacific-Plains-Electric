import { NextResponse } from "next/server";
// Do not acknowledge or process events until the real provider contract and durable event consumer are installed.
export async function POST() {
  return NextResponse.json(
    { error: "Volteira webhook integration is not configured." },
    { status: 503 },
  );
}
