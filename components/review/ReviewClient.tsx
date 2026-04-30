"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft, MapPin } from "lucide-react";
import { useRaffleStore, useHydratedRaffle } from "@/lib/store/raffle-store";
import type { Contestant } from "@/lib/data/contestants";
import { Card } from "@/components/ui/Card";
import { PriceBreakdown } from "@/components/review/PriceBreakdown";

export function ReviewClient({ contestants }: { contestants: Contestant[] }) {
  const router = useRouter();
  const hydrated = useHydratedRaffle();
  const selection = useRaffleStore((s) => s.selection);
  const byId = new Map(contestants.map((c) => [c.id, c]));

  useEffect(() => {
    if (hydrated && selection.length < 5) {
      router.replace("/seleccion");
    }
  }, [hydrated, selection.length, router]);

  if (!hydrated) {
    return <ReviewSkeleton />;
  }

  if (selection.length < 5) {
    return null; // redirecting
  }

  const ordered = selection.slice().sort((a, b) => a.rank - b.rank);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-12">
      <div>
        <Link
          href="/seleccion"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Editar selección
        </Link>

        <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
          Tu Top 5
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
          Confirma tu predicción.
        </h1>
        <p className="mt-4 text-text-secondary max-w-xl leading-relaxed">
          Verifica el orden con cuidado. Una vez procesado el pago, este será el
          ranking que se evaluará contra el resultado oficial.
        </p>

        <ol className="mt-10 space-y-3">
          {ordered.map((p) => {
            const c = byId.get(p.contestantId);
            if (!c) return null;
            return (
              <li key={p.contestantId}>
                <Card padded={false} className="p-4 flex items-center gap-5">
                  <span className="font-heading text-5xl md:text-6xl text-gradient-gold tabular-nums leading-none w-14 text-center shrink-0">
                    {p.rank}
                  </span>
                  <div className="relative h-20 w-16 sm:h-24 sm:w-[72px] shrink-0 rounded-2xl overflow-hidden bg-primary/40">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading text-xl tracking-tight truncate">
                      {c.name}
                    </h2>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-text-secondary">
                      <MapPin
                        size={12}
                        strokeWidth={1.75}
                        className="text-accent/80"
                      />
                      {c.ciudad}
                    </p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>

      <div>
        <PriceBreakdown canContinue={selection.length === 5} />
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-12 animate-pulse">
      <div className="space-y-3">
        <div className="h-12 w-3/4 bg-surface rounded-2xl" />
        <div className="h-5 w-1/2 bg-surface/60 rounded-2xl" />
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-surface rounded-3xl" />
          ))}
        </div>
      </div>
      <div className="h-80 bg-surface rounded-3xl" />
    </div>
  );
}
