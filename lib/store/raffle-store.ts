"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Rank, RankedPick } from "@/lib/raffle/types";

export type { Rank, RankedPick, Ticket, TicketStatus } from "@/lib/raffle/types";
export {
  TICKET_PRICE,
  TICKET_FEE,
  TICKET_TOTAL
} from "@/lib/raffle/constants";

interface RaffleState {
  selection: RankedPick[];
  addPick: (contestantId: string) => void;
  removePick: (contestantId: string) => void;
  reorder: (fromRank: Rank, toRank: Rank) => void;
  clearSelection: () => void;
}

function reassignRanks(picks: RankedPick[]): RankedPick[] {
  return picks
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((p, i) => ({ ...p, rank: (i + 1) as Rank }));
}

export const useRaffleStore = create<RaffleState>()(
  persist(
    (set, get) => ({
      selection: [],

      addPick: (contestantId) => {
        const { selection } = get();
        if (selection.length >= 5) return;
        if (selection.some((p) => p.contestantId === contestantId)) return;
        const nextRank = (selection.length + 1) as Rank;
        set({
          selection: [...selection, { contestantId, rank: nextRank }],
        });
      },

      removePick: (contestantId) => {
        const remaining = get().selection.filter(
          (p) => p.contestantId !== contestantId,
        );
        set({ selection: reassignRanks(remaining) });
      },

      reorder: (fromRank, toRank) => {
        if (fromRank === toRank) return;
        const sorted = get()
          .selection.slice()
          .sort((a, b) => a.rank - b.rank);
        const fromIdx = sorted.findIndex((p) => p.rank === fromRank);
        if (fromIdx === -1) return;
        const [moved] = sorted.splice(fromIdx, 1);
        sorted.splice(toRank - 1, 0, moved);
        set({
          selection: sorted.map((p, i) => ({ ...p, rank: (i + 1) as Rank })),
        });
      },

      clearSelection: () => set({ selection: [] }),
    }),
    {
      name: "feria-tabasco-2026:v2",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function useHydratedRaffle(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    let cancelled = false;
    useRaffleStore.persist.rehydrate()?.finally?.(() => {
      if (!cancelled) setHydrated(true);
    });
    if (useRaffleStore.persist.hasHydrated()) setHydrated(true);
    return () => {
      cancelled = true;
    };
  }, []);
  return hydrated;
}
