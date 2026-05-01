import { createAdminSupabase } from "@/lib/supabase/admin";
import type { RankedPick, TicketStatus } from "@/lib/raffle/types";

export type AdminTicketRow = {
  id: string;
  userId: string;
  email: string | null;
  picks: RankedPick[];
  total: number;
  status: TicketStatus;
  createdAt: string;
};

export async function listAdminTickets(
  status: TicketStatus
): Promise<AdminTicketRow[]> {
  const admin = createAdminSupabase();

  const { data: rows, error } = await admin
    .from("tickets")
    .select("id, user_id, picks, total, status, created_at")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list tickets: ${error.message}`);
  }

  if (!rows || rows.length === 0) return [];

  const { data: users, error: usersError } = await admin.auth.admin.listUsers({
    perPage: 200
  });
  if (usersError) {
    throw new Error(`Failed to list users: ${usersError.message}`);
  }
  const emailById = new Map(users.users.map((u) => [u.id, u.email ?? null]));

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    email: emailById.get(r.user_id) ?? null,
    picks: r.picks as RankedPick[],
    total: r.total,
    status: r.status as TicketStatus,
    createdAt: r.created_at
  }));
}
