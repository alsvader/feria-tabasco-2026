"use client";

import Image from "next/image";
import { CalendarClock } from "lucide-react";
import type { Ticket } from "@/lib/store/raffle-store";
import type { Contestant } from "@/lib/data/contestants";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export function TicketCard({
  ticket,
  contestantsById
}: {
  ticket: Ticket;
  contestantsById: Map<string, Contestant>;
}) {
  const ordered = ticket.picks.slice().sort((a, b) => a.rank - b.rank);

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="grid md:grid-cols-[auto_1fr] gap-0">
        {/* Stub */}
        <div className="relative md:w-56 p-6 bg-gradient-brand-soft border-b md:border-b-0 md:border-r border-dashed border-white/10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
            Boleto
          </p>
          <p className="mt-2 font-heading text-2xl text-gradient-gold tracking-tight">
            {ticket.id}
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-text-secondary">
            <CalendarClock size={12} strokeWidth={1.75} />
            {formatDate(ticket.createdAt)}
          </div>
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
              Total
            </p>
            <p className="mt-1 font-heading text-2xl tabular-nums">
              {formatCurrency(ticket.total)}
            </p>
          </div>
        </div>

        {/* Picks */}
        <div className="p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
            Tu predicción
          </p>
          <ol className="mt-3 grid grid-cols-5 gap-3">
            {ordered.map((p) => {
              const c = contestantsById.get(p.contestantId);
              if (!c) return null;
              return (
                <li
                  key={p.contestantId}
                  className="flex flex-col items-center text-center min-w-0"
                  title={`${c.name} · ${c.ciudad}`}
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-primary/40 border border-white/10">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <span className="absolute -bottom-1 -right-1 grid place-items-center h-6 w-6 rounded-full bg-gradient-gold text-primary text-[11px] font-bold shadow-glow-gold">
                      {p.rank}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] font-medium leading-tight truncate w-full">
                    {c.name.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-text-muted truncate w-full">
                    {c.ciudad}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Card>
  );
}
