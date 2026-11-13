import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrackedRequest } from "@/lib/admin/request-tracker";

/** Rows per database call (the API returns at most 1,000 at a time). */
const BATCH = 1000;
/** Plenty for a small contractor's history; the tracker says so if more exist. */
export const MAX_ROWS = 10_000;

/**
 * Every stored website request, newest first, read in batches through the signed-in
 * owner's session (row-level security allows only owners and admins to read them).
 */
export async function loadAllRequests(db: SupabaseClient): Promise<{ rows: TrackedRequest[]; error: boolean; truncated: boolean }> {
  const rows: TrackedRequest[] = [];
  for (let from = 0; from < MAX_ROWS; from += BATCH) {
    const { data, error } = await db
      .from("website_request_outbox")
      .select("id,payload,status,created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, Math.min(from + BATCH, MAX_ROWS) - 1);
    if (error || !data) return { rows, error: true, truncated: false };
    rows.push(...(data as TrackedRequest[]));
    if (data.length < BATCH) return { rows, error: false, truncated: false };
  }
  return { rows, error: false, truncated: true };
}
