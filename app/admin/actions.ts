"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdmin, sessionDb } from "@/lib/auth/server";
import { productionAdapterReady } from "@/lib/volteira/client";
export async function login(_state: { error: string }, data: FormData) {
  const email = String(data.get("email") || "");
  const password = String(data.get("password") || "");
  if (
    !z.email().safeParse(email).success ||
    password.length < 8 ||
    password.length > 256
  )
    return { error: "Enter your email and password." };
  const db = await sessionDb();
  if (!db) return { error: "Sign-in is not configured." };
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error)
    return {
      error: "Unable to sign in. Check your credentials or try again later.",
    };
  const admin = await getAdmin();
  if (!admin) {
    await db.auth.signOut();
    return { error: "This account does not have website owner access." };
  }
  redirect("/admin/dashboard");
}
export async function logout() {
  const db = await sessionDb();
  await db?.auth.signOut();
  redirect("/admin");
}
const daySchema = z
  .object({
    enabled: z.boolean(),
    start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  })
  .refine(
    (d) => !d.enabled || d.start < d.end,
    "End time must follow start time.",
  );
const schedulingSchema = z.object({
  days: z.array(daySchema).length(7),
  durationMinutes: z.number().int().min(15).max(480),
  travelBufferMinutes: z.number().int().min(0).max(180),
  minimumNoticeHours: z.number().int().min(0).max(720),
  maxAdvanceDays: z.number().int().min(1).max(365),
  sameDay: z.boolean(),
});
export async function saveScheduling(input: unknown) {
  const admin = await getAdmin();
  if (!admin) return { error: "Sign in with website owner access." };
  const parsed = schedulingSchema.safeParse(input);
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message || "Review your settings.",
    };
  const { error } = await admin.db
    .from("website_settings")
    .update({ scheduling: parsed.data, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) return { error: "Settings could not be saved." };
  revalidatePath("/admin");
  return {
    success: "Scheduling preferences saved. Online scheduling remains OFF.",
  };
}
export async function enableScheduling() {
  const admin = await getAdmin();
  if (!admin) return { error: "Unauthorized" };
  if (!productionAdapterReady)
    return {
      error:
        "Online scheduling cannot be enabled until the live Volteira booking adapter is connected and verified.",
    };
  return { error: "Configure and verify live availability before enabling." };
}
export async function saveContent(
  _state: { error?: string; success?: string },
  data: FormData,
) {
  const admin = await getAdmin();
  if (!admin) return { error: "Unauthorized" };
  const schema = z.object({
    kind: z.enum(["article", "project", "faq", "review"]),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    title: z.string().min(1).max(160),
    excerpt: z.string().max(350),
    body: z.string().min(1).max(30000),
    category: z.string().max(60),
    seo_title: z.string().max(70),
    seo_description: z.string().max(170),
    published: z.boolean(),
  });
  const raw = {
    ...Object.fromEntries(data),
    published: data.get("published") === "on",
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message || "Review the content." };
  const payload = parsed.data;
  if (payload.published && (!payload.seo_title || !payload.seo_description))
    return { error: "Add an SEO title and description before publishing." };
  const { error } = await admin.db
    .from("website_content")
    .upsert(
      { ...payload, updated_at: new Date().toISOString() },
      { onConflict: "slug" },
    );
  if (error)
    return {
      error: "Content could not be saved. Check that the slug is unique.",
    };
  revalidatePath("/blog");
  revalidatePath("/projects");
  revalidatePath("/admin");
  return { success: payload.published ? "Published." : "Draft saved." };
}
export async function markReviewed(id: string) {
  const admin = await getAdmin();
  if (!admin || !z.uuid().safeParse(id).success) return;
  await admin.db
    .from("website_request_outbox")
    .update({ status: "reviewed" })
    .eq("id", id);
  revalidatePath("/admin/service-requests");
}

export async function registerOwner(
  _state: { error?: string; success?: string },
  data: FormData,
): Promise<{ error?: string; success?: string }> {
  const email = String(data.get("email") || "")
      .trim()
      .toLowerCase(),
    password = String(data.get("password") || "");
  if (
    !z.email().safeParse(email).success ||
    password.length < 12 ||
    password.length > 256
  )
    return {
      error: "Use a valid email and a password of at least 12 characters.",
    };
  const db = await sessionDb();
  if (!db) return { error: "Account setup is unavailable." };
  const { error } = await db.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://www.pacificplainselectric.com/auth/callback",
    },
  });
  if (error)
    return {
      error:
        "Account setup could not be completed. Try signing in if you already have an account, or try again later.",
    };
  return {
    success:
      "Check your email for the verification link, then return here to sign in. Only addresses granted website access can enter the admin area.",
  };
}
export async function addMember(
  _state: { error?: string; success?: string },
  data: FormData,
): Promise<{ error?: string; success?: string }> {
  const admin = await getAdmin();
  if (!admin) return { error: "Unauthorized" };
  const email = String(data.get("email") || "")
    .trim()
    .toLowerCase();
  const role = String(data.get("role") || "ADMIN");
  if (
    !z.email().safeParse(email).success ||
    !["OWNER", "ADMIN", "TECHNICIAN"].includes(role)
  )
    return { error: "Enter a valid email and role." };
  if (role === "OWNER" && admin.role !== "OWNER")
    return { error: "Only owners can grant ownership." };
  const { error } = await admin.db
    .from("website_members")
    .insert({ email, role, added_by: admin.user.id });
  if (error)
    return {
      error: "Access could not be added. The address may already be listed.",
    };
  revalidatePath("/admin/team");
  return {
    success:
      "Access added. Ask this person to create and verify their account at /admin. No invitation email was sent.",
  };
}
export async function changeMember(
  _state: { error?: string; success?: string },
  data: FormData,
): Promise<{ error?: string; success?: string }> {
  const admin = await getAdmin();
  if (!admin) return { error: "Unauthorized" };
  const email = String(data.get("email") || "").toLowerCase(),
    role = String(data.get("role") || "");
  if (
    !z.email().safeParse(email).success ||
    !["OWNER", "ADMIN", "TECHNICIAN", "REMOVE"].includes(role)
  )
    return { error: "Invalid access change." };
  if (email === admin.user.email?.toLowerCase())
    return { error: "Ask another owner to change your own access." };
  const { data: member } = await admin.db
    .from("website_members")
    .select("role")
    .eq("email", email)
    .single();
  if (
    !member ||
    (admin.role !== "OWNER" && (member.role === "OWNER" || role === "OWNER"))
  )
    return { error: "Only owners can change ownership." };
  const result =
    role === "REMOVE"
      ? await admin.db.from("website_members").delete().eq("email", email)
      : await admin.db
          .from("website_members")
          .update({ role })
          .eq("email", email);
  if (result.error)
    return {
      error: "Access could not be changed. At least one owner must remain.",
    };
  revalidatePath("/admin/team");
  return { success: "Access updated." };
}
