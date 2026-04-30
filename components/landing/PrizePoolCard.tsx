"use client";

import { Sparkles } from "lucide-react";
import { useRaffleStore, useHydratedRaffle, SEED_PRIZE_POOL } from "@/lib/store/raffle-store";
import { formatCurrency } from "@/lib/utils/format";

export function PrizePoolCard() {
  const hydrated = useHydratedRaffle();
  const prizePool = useRaffleStore((s) => s.prizePool);
  const ticketCount = useRaffleStore((s) => s.tickets.length);

  const display = hydrated ? prizePool : SEED_PRIZE_POOL;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-surface/80 backdrop-blur-sm px-5 py-4 shadow-surface">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-gold opacity-[0.06] pointer-events-none"
      />
      <div className="relative flex items-center justify-between gap-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center h-11 w-11 rounded-2xl bg-gold/10 border border-gold/30 text-gold shrink-0">
            <Sparkles size={16} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gold/90">
              Bolsa acumulada
            </p>
            <p
              className="font-heading text-2xl md:text-3xl leading-none tabular-nums shimmer-text"
              aria-live="polite"
            >
              {formatCurrency(display)}
            </p>
          </div>
        </div>
        <p className="hidden sm:block text-[11px] text-text-muted leading-tight max-w-[10rem] text-right shrink-0">
          Crece con cada boleto vendido
          {hydrated && ticketCount > 0 && (
            <span className="block text-text-secondary mt-1">
              {ticketCount} en juego
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
