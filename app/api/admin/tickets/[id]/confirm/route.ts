import { NextResponse } from "next/server";
import { requireAdmin, AdminGateError } from "@/lib/auth/admin";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (err) {
    if (err instanceof AdminGateError) {
      return NextResponse.json(
        { error: err.reason },
        { status: err.reason === "unauthenticated" ? 401 : 403 }
      );
    }
    throw err;
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      confirmed_by: admin.user.id
    })
    .eq("id", params.id)
    .eq("status", "pending")
    .select("id, status, confirmed_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "No pudimos confirmar el boleto." },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json(
      { error: "Ya estaba confirmado." },
      { status: 409 }
    );
  }

  return NextResponse.json({ ticket: data });
}
