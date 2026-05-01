import Image from "next/image";
import { CalendarClock, Check, Clock, Crown } from "lucide-react";
import type { Ticket } from "@/lib/raffle/types";
import { MAX_TICKET_SCORE } from "@/lib/raffle/types";
import type { Contestant } from "@/lib/data/contestants";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function TicketCard({
  ticket,
  contestantsById,
  score,
  isWinner = false
}: {
  ticket: Ticket;
  contestantsById: Map<string, Contestant>;
  score?: number;
  isWinner?: boolean;
}) {
  const ordered = ticket.picks.slice().sort((a, b) => a.rank - b.rank);
  const isConfirmed = ticket.status === "confirmed";

  return (
    <Card
      padded={false}
      className={cn(
        "overflow-hidden",
        isWinner && "border-gold/60 shadow-glow-gold"
      )}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-0">
        <div className="relative md:w-56 p-6 bg-gradient-brand-soft border-b md:border-b-0 md:border-r border-dashed border-white/10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
            Boleto
          </p>
          <p className="mt-2 font-heading text-2xl text-gradient-gold tracking-tight">
            {ticket.id}
          </p>
          <span
            className={
              isWinner
                ? "mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-primary font-bold"
                : isConfirmed
                  ? "mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-300"
                  : "mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-gold"
            }
          >
            {isWinner ? (
              <Crown size={11} strokeWidth={2.25} />
            ) : isConfirmed ? (
              <Check size={11} strokeWidth={2.25} />
            ) : (
              <Clock size={11} strokeWidth={2.25} />
            )}
            {isWinner
              ? "Ganador"
              : isConfirmed
                ? "Confirmado"
                : "Esperando confirmación"}
          </span>
          {typeof score === "number" && (
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Puntaje
              </p>
              <p className="mt-1 font-heading text-xl tabular-nums">
                {score}{" "}
                <span className="text-sm text-text-muted">
                  / {MAX_TICKET_SCORE}
                </span>
              </p>
            </div>
          )}
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
