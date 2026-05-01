"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Coins,
  Crown,
  ReceiptText,
  Sparkles,
  Target,
  Ticket as TicketIcon
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { TicketCard } from "@/components/dashboard/TicketCard";
import { formatCurrency } from "@/lib/utils/format";
import type { Contestant } from "@/lib/data/contestants";
import type { Ticket } from "@/lib/raffle/types";

const TICKETS_PER_PAGE = 4;

function permutationsCount(n: number, k: number): number {
  let result = 1;
  for (let i = 0; i < k; i++) result *= n - i;
  return result;
}

function formatOdds(tickets: number, total: number): string {
  if (tickets === 0) return "—";
  const denominator = Math.floor(total / tickets);
  return `1 en ${denominator.toLocaleString("es-MX")}`;
}

export function DashboardClient({
  contestants,
  tickets,
  prizePool
}: {
  contestants: Contestant[];
  tickets: Ticket[];
  prizePool: number;
}) {
  const [page, setPage] = useState(0);

  const contestantsById = new Map(contestants.map((c) => [c.id, c]));

  const totalContribution = tickets.reduce((sum, t) => sum + t.total, 0);
  const totalCombinations = permutationsCount(contestants.length, 5);
  const confirmedCount = tickets.filter((t) => t.status === "confirmed").length;
  const odds = formatOdds(confirmedCount, totalCombinations);

  const totalPages = Math.max(1, Math.ceil(tickets.length / TICKETS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = tickets.slice(
    safePage * TICKETS_PER_PAGE,
    safePage * TICKETS_PER_PAGE + TICKETS_PER_PAGE
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
            Mi panel
          </p>
          <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
            Tus boletos.
          </h1>
          <p className="mt-3 text-text-secondary max-w-xl leading-relaxed">
            Aquí viven tus predicciones para la coronación de las Embajadoras.
            Compra más boletos para multiplicar tus probabilidades.
          </p>
        </div>
        <Button asChild size="md">
          <Link href="/seleccion">
            Comprar otro boleto
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Boletos"
              value={String(tickets.length)}
              icon={TicketIcon}
              accent="pink"
              hint={
                confirmedCount === tickets.length
                  ? "Todos confirmados"
                  : `${confirmedCount} confirmados`
              }
            />
            <StatCard
              label="Aportación total"
              value={formatCurrency(totalContribution)}
              icon={Coins}
              accent="gold"
              hint="Tu participación acumulada"
            />
            <StatCard
              label="Bolsa actual"
              value={formatCurrency(prizePool)}
              icon={Sparkles}
              accent="gold"
              hint="Crece con cada boleto confirmado"
            />
            <StatCard
              label="Probabilidad"
              value={odds}
              icon={Target}
              accent="pink"
              hint={`Sobre ${totalCombinations.toLocaleString("es-MX")} combinaciones`}
            />
          </div>

          <section className="mt-12">
            <header className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-2xl tracking-tight">
                Historial de boletos
              </h2>
              <span className="text-xs text-text-muted">
                {tickets.length}{" "}
                {tickets.length === 1 ? "boleto" : "boletos"}
              </span>
            </header>
            <ol className="space-y-4">
              {paginated.map((t, i) => (
                <li
                  key={t.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                >
                  <TicketCard ticket={t} contestantsById={contestantsById} />
                </li>
              ))}
            </ol>

            {totalPages > 1 && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </section>
        </>
      )}
    </>
  );
}

function Pagination({
  page,
  totalPages,
  onChange
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav
      aria-label="Paginación de boletos"
      className="mt-8 flex items-center justify-between gap-4"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-white/10 bg-surface/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Anterior
      </button>
      <p className="text-xs text-text-muted tabular-nums">
        Página <span className="text-text-primary">{page + 1}</span> /{" "}
        {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-white/10 bg-surface/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
        <ChevronRight size={14} strokeWidth={2} />
      </button>
    </nav>
  );
}

function EmptyState() {
  return (
    <Card className="mt-10 text-center py-16">
      <div className="grid place-items-center">
        <div
          aria-hidden
          className="relative h-20 w-20 grid place-items-center"
        >
          <span className="absolute inset-0 rounded-full bg-accent/15 blur-2xl" />
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-brand-soft border border-white/10 grid place-items-center">
            <ReceiptText
              size={28}
              strokeWidth={1.5}
              className="text-accent"
            />
          </div>
        </div>
      </div>
      <h2 className="mt-6 font-heading text-2xl tracking-tight">
        Aún no tienes boletos
      </h2>
      <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
        Arma tu Top 5 y entra al juego. Toma un par de minutos.
      </p>
      <Button asChild size="lg" className="mt-7">
        <Link href="/seleccion">
          <Crown size={16} strokeWidth={2} />
          Empezar
        </Link>
      </Button>
    </Card>
  );
}
