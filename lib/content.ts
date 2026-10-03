import "server-only";
import { publicDb } from "@/lib/auth/server";
export type ContentRecord = {
  id: string;
  kind: "article" | "project" | "faq" | "review";
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};
export async function getContent(
  kind: ContentRecord["kind"],
): Promise<ContentRecord[]> {
  const db = publicDb();
  if (!db) return [];
  try {
    const { data, error } = await db
      .from("website_content")
      .select(
        "id,kind,slug,title,excerpt,body,category,published,seo_title,seo_description",
      )
      .eq("kind", kind)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}
