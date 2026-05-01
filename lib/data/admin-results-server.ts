import { createAdminSupabase } from "@/lib/supabase/admin";
import type { RankedPick } from "@/lib/raffle/types";

export type AdminResultsState = {
  picks: RankedPick[] | null;
  publishedAt: string | null;
  updatedAt: string | null;
};

export async function getAdminResults(): Promise<AdminResultsState> {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("contest_results")
    .select("actual_picks, published_at, updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to load admin results: ${error.message}`);
  }
  if (!data) {
    return { picks: null, publishedAt: null, updatedAt: null };
  }
  return {
    picks: data.actual_picks as RankedPick[],
    publishedAt: data.published_at,
    updatedAt: data.updated_at
  };
}
