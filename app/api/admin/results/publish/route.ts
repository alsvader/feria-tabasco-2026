import { NextResponse } from "next/server";
import { requireAdmin, AdminGateError } from "@/lib/auth/admin";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getAdminResults } from "@/lib/data/admin-results-server";

export async function POST() {
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

  const existing = await getAdminResults();
  if (!existing.picks || existing.picks.length !== 5) {
    return NextResponse.json(
      { error: "Guarda los 5 lugares antes de publicar." },
      { status: 400 }
    );
  }
  if (existing.publishedAt) {
    return NextResponse.json(
      { error: "Ya estaban publicados." },
      { status: 409 }
    );
  }

  const admin = createAdminSupabase();
  const { error } = await admin
    .from("contest_results")
    .update({ published_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) {
    return NextResponse.json(
      { error: "No pudimos publicar los resultados." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
