import { NextResponse } from "next/server";
export function GET() {
  return NextResponse.json({
    status: "ok",
    schedulingEnabled: false,
    volteira: "not_connected",
  });
}
