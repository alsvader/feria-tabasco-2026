import { NextResponse } from "next/server";
import { requireAdmin, AdminGateError } from "@/lib/auth/admin";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getContestants } from "@/lib/data/contestants-server";
import { validatePicks } from "@/lib/raffle/validate";
import { getAdminResults } from "@/lib/data/admin-results-server";

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminGateError) {
      return NextResponse.json(
        { error: err.reason },
        { status: err.reason === "unauthenticated" ? 401 : 403 }
      );
    }
    throw err;
  }
  const state = await getAdminResults();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminGateError) {
      return NextResponse.json(
        { error: err.reason },
        { status: err.reason === "unauthenticated" ? 401 : 403 }
      );
    }
    throw err;
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

  const admin = createAdminSupabase();
  const existing = await getAdminResults();
  if (existing.publishedAt) {
    return NextResponse.json(
      {
        error:
          "Los resultados ya están publicados. Despublica antes de editar."
      },
      { status: 409 }
    );
  }

  const { error } = await admin.from("contest_results").upsert({
    id: 1,
    actual_picks: validation.picks,
    updated_at: new Date().toISOString()
  });
  if (error) {
    return NextResponse.json(
      { error: "No pudimos guardar los resultados." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
