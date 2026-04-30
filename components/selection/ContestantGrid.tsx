"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Contestant } from "@/lib/data/contestants";
import { useRaffleStore, useHydratedRaffle } from "@/lib/store/raffle-store";
import { ContestantCard } from "@/components/selection/ContestantCard";
import { SelectionStrip } from "@/components/selection/SelectionStrip";
import { Button } from "@/components/ui/Button";

export function ContestantGrid({
  contestants
}: {
  contestants: Contestant[];
}) {
  const hydrated = useHydratedRaffle();
  const selection = useRaffleStore((s) => s.selection);
  const addPick = useRaffleStore((s) => s.addPick);
  const removePick = useRaffleStore((s) => s.removePick);

  const selectedMap = new Map(selection.map((p) => [p.contestantId, p.rank]));
  const selectionFull = selection.length >= 5;
  const complete = selection.length === 5;

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 mb-6 bg-bg/85 backdrop-blur-md border-b border-white/[0.06]">
        <SelectionStrip contestants={contestants} />
      </div>

      <div
        id="participantes"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        role="list"
        aria-label="Lista de candidatas"
      >
        {contestants.map((c, i) => {
          const rank = selectedMap.get(c.id) ?? null;
          return (
            <div
              key={c.id}
              role="listitem"
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
            >
              <ContestantCard
                contestant={c}
                rank={rank}
                selectionFull={selectionFull}
                onToggle={() => {
                  if (!hydrated) return;
                  if (rank !== null) removePick(c.id);
                  else addPick(c.id);
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-10 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            asChild={complete}
            variant="primary"
            size="lg"
            disabled={!complete}
            aria-live="polite"
          >
            {complete ? (
              <Link href="/revision">
                Continuar
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            ) : (
              <span>
                Selecciona {Math.max(0, 5 - selection.length)} más
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
