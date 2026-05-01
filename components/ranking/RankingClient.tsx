import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, Sparkles, TrendingUp } from "lucide-react";
import type { Contestant } from "@/lib/data/contestants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PodiumCard } from "@/components/ranking/PodiumCard";
import type { RankingRow } from "@/lib/data/tickets-server";

export function RankingClient({
  contestants,
  ranking
}: {
  contestants: Contestant[];
  ranking: RankingRow[];
}) {
  const byId = new Map(contestants.map((c) => [c.id, c]));

  if (ranking.length === 0) {
    return <TeaserEmpty />;
  }

  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3, 13);

  const podiumContestants = podium
    .map((s) => ({ contestant: byId.get(s.contestantId), score: s.score }))
    .filter(
      (x): x is { contestant: Contestant; score: number } => Boolean(x.contestant)
    );

  const ordered: Array<{ tier: 1 | 2 | 3; data: typeof podiumContestants[number] }> =
    podiumContestants.length === 3
      ? [
          { tier: 2, data: podiumContestants[1] },
          { tier: 1, data: podiumContestants[0] },
          { tier: 3, data: podiumContestants[2] }
        ]
      : podiumContestants.map((d, i) => ({ tier: (i + 1) as 1 | 2 | 3, data: d }));

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
          Comunidad
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
          Ranking de participantes.
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Las candidatas más predichas según los boletos en juego. La puntuación
          pondera el orden de cada predicción.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:items-end">
        {ordered.map(({ tier, data }) => (
          <PodiumCard
            key={data.contestant.id}
            tier={tier}
            contestant={data.contestant}
            score={data.score}
          />
        ))}
      </div>

      {rest.length > 0 && (
        <section className="mt-14">
          <header className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl tracking-tight">
              Resto del ranking
            </h2>
            <span className="text-xs text-text-muted">
              Top {3 + rest.length} de {contestants.length}
            </span>
          </header>
          <ol className="space-y-2">
            {rest.map((s, i) => {
              const c = byId.get(s.contestantId);
              if (!c) return null;
              return (
                <li
                  key={s.contestantId}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-surface/70 px-4 py-3"
                >
                  <span className="font-heading text-xl text-gold/70 tabular-nums w-8 text-center">
                    {i + 4}
                  </span>
                  <div className="relative h-11 w-11 shrink-0 rounded-xl overflow-hidden bg-primary/40">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-[11px] text-text-muted truncate">
                      {c.ciudad}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary tabular-nums">
                    <TrendingUp size={12} strokeWidth={1.75} className="text-accent/70" />
                    {s.score}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </>
  );
}

function TeaserEmpty() {
  return (
    <>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
          Comunidad
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
          Ranking de participantes.
        </h1>
      </div>

      <Card glow="pink" className="relative overflow-hidden mt-10 max-w-3xl mx-auto text-center py-14 md:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-brand-soft opacity-60 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl pointer-events-none animate-pulse-soft"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl pointer-events-none animate-pulse-soft"
          style={{ animationDelay: "1.2s" }}
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
            La emoción está por comenzar.
          </h2>
          <p className="mt-4 text-sm md:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
            Aún no hay suficientes boletos para mostrar un ranking. Sé de las
            primeras personas en armar tu predicción.
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
