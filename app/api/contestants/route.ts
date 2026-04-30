import { NextResponse } from "next/server";
import { getContestants } from "@/lib/data/contestants-server";

export async function GET() {
  try {
    const contestants = await getContestants();
    return NextResponse.json({ contestants });
  } catch (err) {
    console.error("[/api/contestants] failed:", err);
    return NextResponse.json(
      { error: "No pudimos cargar las candidatas." },
      { status: 500 }
    );
  }
}
