"use client";

import Image from "next/image";
import type { Contestant } from "@/lib/data/contestants";
import { cn } from "@/lib/utils/cn";

interface Props {
  contestant: Contestant;
  rank: number | null;
  selectionFull: boolean;
  onToggle: () => void;
}

export function ContestantCard({ contestant, rank, selectionFull, onToggle }: Props) {
  const selected = rank !== null;
  const disabled = !selected && selectionFull;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={
        selected
          ? `Quitar a ${contestant.name} del puesto ${rank}`
          : `Añadir a ${contestant.name}`
      }
      className={cn(
        "group relative block w-full text-left rounded-2xl overflow-hidden bg-surface border transition-all duration-300",
        "border-white/[0.06] hover:border-accent/40 hover:-translate-y-0.5",
        selected &&
          "border-gold/60 shadow-glow-gold ring-1 ring-gold/30 hover:border-gold/70",
        "active:scale-[0.98]",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-white/[0.06] disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-primary/40">
        <Image
          src={contestant.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-bg/95 via-bg/40 to-transparent pointer-events-none"
        />
        {selected && (
          <div className="absolute top-2 right-2 grid place-items-center h-7 w-7 rounded-full bg-gradient-gold text-primary text-xs font-bold shadow-glow-gold tabular-nums">
            {rank}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-heading text-sm leading-tight tracking-tight truncate">
            {contestant.name}
          </p>
          <p className="text-[10px] text-text-secondary truncate mt-0.5">
            {contestant.ciudad}
          </p>
        </div>
      </div>
    </button>
  );
}
