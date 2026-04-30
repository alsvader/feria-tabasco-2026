"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import { shortId } from "@/lib/utils/format";

export type Rank = 1 | 2 | 3 | 4 | 5;

export type RankedPick = {
  contestantId: string;
  rank: Rank;
};

export type Ticket = {
  id: string;
  picks: RankedPick[];
  total: number;
  createdAt: string;
};

export const TICKET_PRICE = 30;
export const TICKET_FEE = 6;
export const TICKET_TOTAL = TICKET_PRICE + TICKET_FEE;
export const SEED_PRIZE_POOL = 18_500;

interface RaffleState {
  selection: RankedPick[];
  tickets: Ticket[];
  prizePool: number;
  addPick: (contestantId: string) => void;
  removePick: (contestantId: string) => void;
  reorder: (fromRank: Rank, toRank: Rank) => void;
  clearSelection: () => void;
  purchaseTicket: () => Ticket | null;
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
      tickets: [],
      prizePool: SEED_PRIZE_POOL,

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

      purchaseTicket: () => {
        const { selection, tickets, prizePool } = get();
        if (selection.length !== 5) return null;
        const ticket: Ticket = {
          id: `BTL-${shortId()}`,
          picks: selection.map((p) => ({ ...p })),
          total: TICKET_TOTAL,
          createdAt: new Date().toISOString(),
        };
        set({
          tickets: [ticket, ...tickets],
          prizePool: prizePool + TICKET_PRICE,
          selection: [],
        });
        return ticket;
      },
    }),
    {
      name: "feria-tabasco-2026:v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

/**
 * Hydrates the persisted store after mount and exposes a boolean
 * gate that consumers can use to avoid SSR/CSR mismatch flicker.
 */
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
