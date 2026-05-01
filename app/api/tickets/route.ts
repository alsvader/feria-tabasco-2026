import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getContestants } from "@/lib/data/contestants-server";
import { validatePicks } from "@/lib/raffle/validate";
import { TICKET_TOTAL } from "@/lib/raffle/constants";
import { shortId } from "@/lib/utils/format";
import type { Ticket } from "@/lib/raffle/types";

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Inicia sesión para comprar." },
      { status: 401 }
    );
  }

  let body: { picks?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const contestants = await getContestants();
  const validation = validatePicks(
    body.picks,
    new Set(contestants.map((c) => c.id))
  );
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const insertOnce = async (id: string) =>
    supabase
      .from("tickets")
      .insert({
        id,
        user_id: user.id,
        picks: validation.picks,
        total: TICKET_TOTAL,
        status: "pending"
      })
      .select("id, picks, total, status, created_at, confirmed_at")
      .single();

  let id = `BTL-${shortId()}`;
  let { data, error } = await insertOnce(id);
  if (error?.code === "23505") {
    id = `BTL-${shortId()}`;
    ({ data, error } = await insertOnce(id));
  }
  if (error || !data) {
    return NextResponse.json(
      { error: "No pudimos guardar tu boleto. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  const ticket: Ticket = {
    id: data.id,
    picks: data.picks,
    total: data.total,
    status: data.status,
    createdAt: data.created_at,
    confirmedAt: data.confirmed_at
  };

  return NextResponse.json({ ticket });
}
