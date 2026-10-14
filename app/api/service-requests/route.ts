import { smsEs } from "@/lib/i18n/shared";
import { NextResponse, after } from "next/server";
import { requestSchema, hazardMessage } from "@/lib/security/validation";
import { publicDb } from "@/lib/auth/server";
import { business, smsDisclosure, diagnosticTerms } from "@/config/business";
import { sendRequestEmail } from "@/lib/notify/request-email";
import { forwardServiceRequest, volteiraConfig, volteiraPayload } from "@/lib/volteira/forward";
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const expected = new URL(req.url).protocol + "//" + req.headers.get("host");
  if (!origin || origin !== expected)
    return NextResponse.json(
      { error: "Please submit from this website." },
      { status: 403 },
    );
  if (!req.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Unsupported request format." },
      { status: 415 },
    );
  if (Number(req.headers.get("content-length") || 0) > 14000)
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  try {
    const raw = await req.text();
    if (raw.length > 14000)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    const parsed = requestSchema.safeParse(JSON.parse(raw));
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Review your details." },
        { status: 400 },
      );
    const input = parsed.data;
    const hazard = hazardMessage(input.description);
    if (hazard) return NextResponse.json({ error: hazard }, { status: 422 });
    const db = publicDb();
    if (!db)
      return NextResponse.json(
        {
          error: "Online requests are unavailable. Please call (805) 626-7761.",
        },
        { status: 503 },
      );
    const { data, error } = await db.rpc("submit_website_request", {
      p_key: input.idempotencyKey,
      p_payload: {
        ...input,
        smsDisclosure: input.smsConsent ? (input.preferredLanguage === "es" ? smsEs : smsDisclosure) : null,
      },
    });
    if (error) {
      const limited = error.code === "P0001" && error.message.includes("limit");
      return NextResponse.json(
        {
          error: limited
            ? "We have received several requests from these contact details. Please call us for help."
            : "Your request could not be saved. Please retry with the same details or call (805) 626-7761.",
        },
        { status: limited ? 429 : 503 },
      );
    }
    if (typeof data !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data)) {
      return NextResponse.json(
        { error: "We could not confirm your request. Please retry with the same details or call (805) 626-7761." },
        { status: 503 },
      );
    }
    const reference = String(data);
    const volteira = volteiraConfig(process.env);
    // After responding, so the customer isn't kept waiting: hand the request to
    // Volteira first, then email the owner saying whether it got there. The
    // request is already saved here, so neither step can lose it.
    after(async () => {
      const forwarded = volteira
        ? await forwardServiceRequest(
            volteira,
            volteiraPayload(input, reference, {
              smsDisclosure: input.preferredLanguage === "es" ? smsEs : smsDisclosure,
              site: new URL(business.siteUrl).hostname.replace(/^www\./, ""),
            }),
          )
        : null;
      if (forwarded && !forwarded.sent)
        console.error(`Request ${reference} is not in Volteira (${forwarded.reason}); the owner email says so.`);
      await sendRequestEmail(input, reference, forwarded);
    });
    // Volteira's assistant texts customers who agreed to texts.
    const textFollowUp = Boolean(volteira) && input.smsConsent;
    return NextResponse.json(
      {
        reference: data,
        status: "received",
        textFollowUp,
        message: `Your request has been received. ${textFollowUp ? "We’ll text you in a moment to get a few details." : "We’ll contact you to discuss the next steps."} This is not a confirmed appointment. ${diagnosticTerms}`,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not process the request. Please try again or call (805) 626-7761.",
      },
      { status: 400 },
    );
  }
}
