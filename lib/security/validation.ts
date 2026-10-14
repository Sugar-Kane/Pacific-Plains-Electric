import { z } from "zod";
import { requestable } from "@/config/content";
export const requestSchema = z
  .object({
    idempotencyKey: z.uuid(),
    preferredLanguage: z.enum(["en", "es"]).default("en"),
    firstName: z.string().trim().min(1, "Enter your first name.").max(80),
    lastName: z.string().trim().min(1, "Enter your last name.").max(80),
    phone: z
      .string()
      .trim()
      .min(10)
      .max(25)
      .refine(
        (s) => /^\+?[\d ()-]+$/.test(s) && s.replace(/\D/g, "").length >= 10,
        "Enter a valid phone number.",
      ),
    email: z.union([z.email().max(254), z.literal("")]).default(""),
    address: z.string().trim().max(200).default(""),
    city: z
      .string()
      .trim()
      .max(80)
      .refine(
        (s) => !s || (s.length >= 2 && /[a-zA-Z]/.test(s)),
        "Enter a city or valid ZIP code.",
      )
      .default(""),
    postalCode: z
      .union([z.string().regex(/^\d{5}(?:-\d{4})?$/), z.literal("")])
      .default(""),
    service: z
      .string()
      .refine((s) => (requestable as readonly string[]).includes(s)),
    description: z.string().trim().max(2000).default(""),
    preferredTimes: z.string().trim().max(300),
    contactMethod: z.enum(["phone", "email", "text"]),
    transactionalConsent: z.literal(true),
    smsConsent: z.boolean(),
    website: z.string().max(0),
  })
  .refine((v) => !!(v.city || v.postalCode), {
    message: "Enter your city or ZIP code.",
    path: ["city"],
  })
  .refine((v) => v.contactMethod !== "text" || v.smsConsent, {
    message: "Please agree to text messages or choose Phone call.",
    path: ["smsConsent"],
  })
  .refine((v) => v.contactMethod !== "email" || !!v.email, {
    message: "Enter an email address or choose a phone call.",
    path: ["email"],
  });
export type ServiceRequestInput = z.infer<typeof requestSchema>;
export function hazardMessage(text: string) {
  return /\b(fire|smoke|sparking|burning smell|electrical shock|hot (?:electrical )?panel|incendio|humo|chispas|olor a quemado|descarga eléctrica|cables? caídos?|downed (?:power |electrical )?(?:line|wire))\b/i.test(
    text,
  )
    ? "If there is an immediate hazard, move away and call 911. Do not touch equipment or downed wires. For a non-emergency concern, call us to discuss the next step."
    : null;
}
