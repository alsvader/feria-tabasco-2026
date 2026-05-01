import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  PublishedResults,
  RankedPick,
  WinnerTicket,
  MyTicketScore
} from "@/lib/raffle/types";

export const getPublishedResults = cache(
  async (): Promise<PublishedResults | null> => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.rpc("public_results");
    if (error) {
      throw new Error(`Failed to load results: ${error.message}`);
    }
    if (!data) return null;
    const row = data as { picks: RankedPick[]; published_at: string };
    return { picks: row.picks, publishedAt: row.published_at };
  }
);

export const getPublicWinners = cache(async (): Promise<WinnerTicket[]> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("public_winners");
  if (error) {
    throw new Error(`Failed to load winners: ${error.message}`);
  }
  return (
    data as { ticket_id: string; score: number; prize_share: number }[]
  ).map((r) => ({
    ticketId: r.ticket_id,
    score: r.score,
    prizeShare: r.prize_share
  }));
});

export const getMyTicketScores = cache(
  async (): Promise<Map<string, number>> => {
    const supabase = createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return new Map();

    const { data, error } = await supabase.rpc("my_ticket_scores");
    if (error) {
      throw new Error(`Failed to load my scores: ${error.message}`);
    }
    const rows = data as MyTicketScore[] | { ticket_id: string; score: number }[];
    const map = new Map<string, number>();
    for (const row of rows) {
      const ticketId = "ticket_id" in row ? row.ticket_id : row.ticketId;
      map.set(ticketId, row.score);
    }
    return map;
  }
);

