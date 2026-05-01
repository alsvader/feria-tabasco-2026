import type { Rank, RankedPick } from "@/lib/raffle/types";

type Result =
  | { ok: true; picks: RankedPick[] }
  | { ok: false; error: string };

export function validatePicks(
  input: unknown,
  contestantIds: Set<string>
): Result {
  if (!Array.isArray(input)) {
    return { ok: false, error: "Selección inválida." };
  }
  if (input.length !== 5) {
    return { ok: false, error: "Debes elegir exactamente 5 candidatas." };
  }

  const picks: RankedPick[] = [];
  const seenIds = new Set<string>();
  const seenRanks = new Set<number>();

  for (const raw of input) {
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: "Selección inválida." };
    }
    const { contestantId, rank } = raw as {
      contestantId?: unknown;
      rank?: unknown;
    };
    if (typeof contestantId !== "string" || !contestantIds.has(contestantId)) {
      return { ok: false, error: "Una de las candidatas no es válida." };
    }
    if (
      typeof rank !== "number" ||
      !Number.isInteger(rank) ||
      rank < 1 ||
      rank > 5
    ) {
      return { ok: false, error: "Las posiciones deben ser del 1 al 5." };
    }
    if (seenIds.has(contestantId)) {
      return { ok: false, error: "No puedes repetir una candidata." };
    }
    if (seenRanks.has(rank)) {
      return { ok: false, error: "No puedes repetir una posición." };
    }
    seenIds.add(contestantId);
    seenRanks.add(rank);
    picks.push({ contestantId, rank: rank as Rank });
  }

  return { ok: true, picks };
}
