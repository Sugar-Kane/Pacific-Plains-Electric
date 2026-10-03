import { z } from "zod";
import { services } from "@/config/content";
export const requestSchema = z.object({
  idempotencyKey: z.uuid(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(25)
    .refine(
      (s) => /^\+?[\d ()-]+$/.test(s) && s.replace(/\D/g, "").length >= 10,
      "Enter a valid phone number.",
    ),
  email: z.email().max(254),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(80),
  postalCode: z.string().regex(/^\d{5}(?:-\d{4})?$/),
  service: z.string().refine((s) => services.some((x) => x.slug === s)),
  description: z.string().trim().min(10).max(2000),
  preferredTimes: z.string().trim().max(300),
  contactMethod: z.enum(["phone", "email"]),
  transactionalConsent: z.literal(true),
  smsConsent: z.boolean(),
  website: z.string().max(0),
});
export type ServiceRequestInput = z.infer<typeof requestSchema>;
export function hazardMessage(text: string) {
  return /\b(fire|smoke|sparking|burning smell|electrical shock|hot (?:electrical )?panel|downed (?:power |electrical )?(?:line|wire))\b/i.test(
    text,
  )
    ? "If there is an immediate hazard, move away and call 911. Do not touch equipment or downed wires. For a non-emergency concern, call us to discuss the next step."
    : null;
}
