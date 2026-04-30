import Image from "next/image";
import { Crown } from "lucide-react";
import type { Contestant } from "@/lib/data/contestants";
import { cn } from "@/lib/utils/cn";

type Tier = 1 | 2 | 3;

interface Props {
  tier: Tier;
  contestant: Contestant;
  score: number;
}

const tierStyle: Record<Tier, { ring: string; bg: string; text: string; label: string }> = {
  1: {
    ring: "border-gold/60 shadow-glow-gold",
    bg: "bg-gradient-gold",
    text: "text-primary",
    label: "Oro"
  },
  2: {
    ring: "border-text-secondary/40 shadow-surface-lg",
    bg: "bg-text-secondary/90",
    text: "text-primary",
    label: "Plata"
  },
  3: {
    ring: "border-amber-700/50 shadow-surface",
    bg: "bg-amber-700",
    text: "text-white",
    label: "Bronce"
  }
};

export function PodiumCard({ tier, contestant, score }: Props) {
  const style = tierStyle[tier];
  const elevated = tier === 1;

  return (
    <article
      className={cn(
        "relative rounded-3xl border bg-surface/80 backdrop-blur-sm p-6 flex flex-col items-center text-center",
        "transition-all duration-300 hover:-translate-y-1",
        style.ring,
        elevated && "lg:-mt-6 lg:pt-9"
      )}
    >
      <div
        className={cn(
          "absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-bold",
          style.bg,
          style.text
        )}
      >
        {tier === 1 && <Crown size={11} strokeWidth={2.5} />}
        #{tier} · {style.label}
      </div>

      <div
        className={cn(
          "relative aspect-square w-full max-w-[180px] rounded-2xl overflow-hidden border-2 mt-2",
          tier === 1 ? "border-gold/50" : "border-white/10"
        )}
      >
        <Image
          src={contestant.image}
          alt={contestant.name}
          fill
          sizes="180px"
          className="object-cover"
        />
      </div>

      <h3 className="mt-5 font-heading text-xl tracking-tight leading-tight">
        {contestant.name}
      </h3>
      <p className="mt-1 text-xs text-text-secondary">{contestant.ciudad}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
        <span>Puntaje</span>
        <span className="font-heading text-lg text-gradient-gold tabular-nums normal-case tracking-normal">
          {score}
        </span>
      </div>
    </article>
  );
}
