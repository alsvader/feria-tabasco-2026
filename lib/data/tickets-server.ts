import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Ticket, TicketStatus, RankedPick } from "@/lib/raffle/types";

type TicketRow = {
  id: string;
  picks: RankedPick[];
  total: number;
  status: TicketStatus;
  created_at: string;
  confirmed_at: string | null;
};

export const getMyTickets = cache(async (): Promise<Ticket[]> => {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("tickets")
    .select("id, picks, total, status, created_at, confirmed_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load tickets: ${error.message}`);
  }

  return (data as TicketRow[]).map((row) => ({
    id: row.id,
    picks: row.picks,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    confirmedAt: row.confirmed_at
  }));
});

export const getPrizePoolStats = cache(
  async (): Promise<{ prizePool: number; ticketCount: number }> => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.rpc("public_prize_pool");
    if (error) {
      throw new Error(`Failed to load prize pool: ${error.message}`);
    }
    const row = (data as { prize_pool: number; ticket_count: number }[])[0];
    return {
      prizePool: row?.prize_pool ?? 0,
      ticketCount: row?.ticket_count ?? 0
    };
  }
);

export type RankingRow = { contestantId: string; score: number };

export const getPublicRanking = cache(async (): Promise<RankingRow[]> => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("public_ranking");
  if (error) {
    throw new Error(`Failed to load ranking: ${error.message}`);
  }
  return (data as { contestant_id: string; score: number }[]).map((r) => ({
    contestantId: r.contestant_id,
    score: r.score
  }));
});
