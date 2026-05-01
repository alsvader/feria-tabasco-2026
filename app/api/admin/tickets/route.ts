import { NextResponse } from "next/server";
import { requireAdmin, AdminGateError } from "@/lib/auth/admin";
import { listAdminTickets } from "@/lib/data/admin-tickets-server";
import type { TicketStatus } from "@/lib/raffle/types";

export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const status = (url.searchParams.get("status") ?? "pending") as TicketStatus;
  const tickets = await listAdminTickets(status);
  return NextResponse.json({ tickets });
}
