import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, Sparkles, Trophy } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getContestants } from "@/lib/data/contestants-server";
import {
  getPublicTicketResults,
  getPublicWinners,
  getPublishedResults
} from "@/lib/data/results-server";
import { getTicketEmailsByIds } from "@/lib/data/admin-tickets-server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { MAX_TICKET_SCORE } from "@/lib/raffle/types";

export const metadata = { title: "Resultados" };

export default async function ResultadosPage() {
  const [contestants, results, winners, allTickets] = await Promise.all([
    getContestants(),
    getPublishedResults(),
    getPublicWinners(),
    getPublicTicketResults()
  ]);
  const byId = new Map(contestants.map((c) => [c.id, c]));

  const winnerIds = new Set(winners.map((w) => w.ticketId));
  const otherTickets = allTickets
    .filter((t) => !winnerIds.has(t.ticketId))
    .sort((a, b) => b.score - a.score || a.ticketId.localeCompare(b.ticketId));

  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const showOwnerEmails = isAdmin(user) && allTickets.length > 0;
  const emailByTicketId = showOwnerEmails
    ? await getTicketEmailsByIds(allTickets.map((t) => t.ticketId))
    : new Map<string, string | null>();

  const officialIds = new Set(results?.picks.map((p) => p.contestantId) ?? []);

  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between gap-6">
          <Link href="/">
            <Wordmark size="sm" />
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/ranking"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Ranking
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Mis boletos
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 lg:px-10 py-12 md:py-16">
        {!results ? (
          <Teaser />
        ) : (
          <>
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
                Resultados oficiales
              </p>
              <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
                El Top 5 está coronado.
              </h1>
              <p className="mt-3 text-text-secondary leading-relaxed">
                Estas son las 5 Embajadoras anunciadas en la coronación de la
                Feria Tabasco 2026.
              </p>
            </div>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {results.picks
                .slice()
                .sort((a, b) => a.rank - b.rank)
                .map((p) => {
                  const c = byId.get(p.contestantId);
                  if (!c) return null;
                  return (
                    <li
                      key={p.rank}
                      className="relative rounded-3xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm p-5 text-center"
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-bold bg-surface-2 text-text-secondary border border-white/10">
                        #{p.rank}
                      </div>
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 mt-2 border-white/10">
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          sizes="(min-width: 1024px) 200px, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-4 font-heading text-lg tracking-tight leading-tight">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs text-text-muted">
                        {c.ciudad}
                      </p>
                    </li>
                  );
                })}
            </ol>

            <section className="mt-16">
              <header className="flex items-center justify-between gap-3 mb-5">
                <h2 className="font-heading text-2xl tracking-tight inline-flex items-center gap-2">
                  <Trophy size={20} strokeWidth={2} className="text-gold" />
                  Ganadores
                </h2>
                <span className="text-xs text-text-muted">
                  Aciertos máximos: {MAX_TICKET_SCORE}
                </span>
              </header>

              {winners.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-text-secondary">
                    Esta vez nadie acertó suficiente para llevarse la bolsa.
                    La predicción fue dura.
                  </p>
                </Card>
              ) : (
                <ol className="space-y-3">
                  {winners.map((w) => (
                    <li
                      key={w.ticketId}
                      className="rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="grid place-items-center h-11 w-11 rounded-2xl bg-gradient-gold text-primary shrink-0">
                          <Crown size={16} strokeWidth={2.25} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-xl text-gradient-gold tracking-tight">
                            {w.ticketId}
                          </p>
                          {showOwnerEmails && emailByTicketId.get(w.ticketId) && (
                            <p className="text-xs text-text-secondary truncate">
                              {emailByTicketId.get(w.ticketId)}
                            </p>
                          )}
                          <p className="text-xs text-text-muted">
                            Aciertos {w.score} / {MAX_TICKET_SCORE}
                          </p>
                        </div>
                        <p className="font-heading text-2xl text-gradient-gold tabular-nums">
                          {formatCurrency(w.prizeShare)}
                        </p>
                      </div>
                      <ul className="mt-4 grid grid-cols-5 gap-2">
                        {w.picks
                          .slice()
                          .sort((a, b) => a.rank - b.rank)
                          .map((p) => {
                            const c = byId.get(p.contestantId);
                            if (!c) return null;
                            const hit = officialIds.has(p.contestantId);
                            return (
                              <li
                                key={p.rank}
                                className="flex flex-col items-center gap-1.5"
                              >
                                <div
                                  className={cn(
                                    "relative aspect-square w-full rounded-xl overflow-hidden border-2",
                                    hit
                                      ? "border-gold/60 shadow-glow-gold"
                                      : "border-white/10 opacity-50"
                                  )}
                                >
                                  <Image
                                    src={c.image}
                                    alt={c.name}
                                    fill
                                    sizes="(min-width: 768px) 80px, 18vw"
                                    className="object-cover"
                                  />
                                </div>
                                <p
                                  className={cn(
                                    "text-[11px] text-center leading-tight line-clamp-2",
                                    hit
                                      ? "text-text-primary"
                                      : "text-text-muted"
                                  )}
                                >
                                  {c.name}
                                </p>
                              </li>
                            );
                          })}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {otherTickets.length > 0 && (
              <section className="mt-16">
                <header className="flex items-center justify-between gap-3 mb-5">
                  <h2 className="font-heading text-2xl tracking-tight">
                    Resto de boletos
                  </h2>
                  <span className="text-xs text-text-muted">
                    {otherTickets.length}{" "}
                    {otherTickets.length === 1 ? "boleto" : "boletos"}
                  </span>
                </header>

                <ol className="space-y-3">
                  {otherTickets.map((t) => (
                    <li
                      key={t.ticketId}
                      className="rounded-2xl border border-white/[0.06] bg-surface/60 px-5 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-lg tracking-tight">
                            {t.ticketId}
                          </p>
                          {showOwnerEmails && emailByTicketId.get(t.ticketId) && (
                            <p className="text-xs text-text-secondary truncate">
                              {emailByTicketId.get(t.ticketId)}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-text-muted tabular-nums">
                          Aciertos {t.score} / {MAX_TICKET_SCORE}
                        </p>
                      </div>
                      <ul className="mt-4 grid grid-cols-5 gap-2">
                        {t.picks
                          .slice()
                          .sort((a, b) => a.rank - b.rank)
                          .map((p) => {
                            const c = byId.get(p.contestantId);
                            if (!c) return null;
                            const hit = officialIds.has(p.contestantId);
                            return (
                              <li
                                key={p.rank}
                                className="flex flex-col items-center gap-1.5"
                              >
                                <div
                                  className={cn(
                                    "relative aspect-square w-full rounded-xl overflow-hidden border-2",
                                    hit
                                      ? "border-gold/60"
                                      : "border-white/10 opacity-50"
                                  )}
                                >
                                  <Image
                                    src={c.image}
                                    alt={c.name}
                                    fill
                                    sizes="(min-width: 768px) 80px, 18vw"
                                    className="object-cover"
                                  />
                                </div>
                                <p
                                  className={cn(
                                    "text-[11px] text-center leading-tight line-clamp-2",
                                    hit
                                      ? "text-text-primary"
                                      : "text-text-muted"
                                  )}
                                >
                                  {c.name}
                                </p>
                              </li>
                            );
                          })}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Teaser() {
  return (
    <>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
          Resultados
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
          La coronación está por llegar.
        </h1>
      </div>
      <Card
        glow="gold"
        className="relative overflow-hidden mt-10 max-w-3xl mx-auto text-center py-14 md:py-20"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-brand-soft opacity-60 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl pointer-events-none animate-pulse-soft"
        />
        <div className="relative">
          <div className="grid place-items-center">
            <div className="relative h-20 w-20 grid place-items-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-gold/30 blur-xl"
              />
              <div className="relative h-16 w-16 rounded-full bg-gradient-gold grid place-items-center shadow-glow-gold">
                <Crown size={28} strokeWidth={2} className="text-primary" />
              </div>
            </div>
          </div>
          <p className="mt-7 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-gold">
            <Sparkles size={12} strokeWidth={2} />
            Próximamente
          </p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl tracking-tight">
            Aquí publicaremos el Top 5 oficial.
          </h2>
          <p className="mt-4 text-sm md:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
            En cuanto el comité anuncie a las Embajadoras, esta página se
            llenará con los resultados y los boletos ganadores.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/seleccion">
              <Crown size={16} strokeWidth={2} />
              Armar mi Top 5
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </Card>
    </>
  );
}
