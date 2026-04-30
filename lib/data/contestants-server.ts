import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Contestant } from "@/lib/data/contestants";

type ContestantRow = {
  id: string;
  name: string;
  ciudad: string;
  bio: string;
  image: string;
  sort_order: number;
};

export const getContestants = cache(async (): Promise<Contestant[]> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("contestants")
    .select("id, name, ciudad, bio, image, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load contestants: ${error.message}`);
  }

  return (data as ContestantRow[]).map(({ sort_order, ...rest }) => rest);
});

export async function findContestantById(
  id: string
): Promise<Contestant | undefined> {
  const all = await getContestants();
  return all.find((c) => c.id === id);
}
