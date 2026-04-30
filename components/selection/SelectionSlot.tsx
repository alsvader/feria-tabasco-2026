"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import type { Contestant } from "@/lib/data/contestants";
import type { Rank } from "@/lib/store/raffle-store";
import { cn } from "@/lib/utils/cn";

interface Props {
  rank: Rank;
  contestant?: Contestant;
  onRemove?: () => void;
}

export function SelectionSlot({ rank, contestant, onRemove }: Props) {
  const sortable = useSortable({
    id: `rank-${rank}`,
    disabled: !contestant
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = sortable;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  if (!contestant) {
    return (
      <li
        ref={setNodeRef}
        style={style}
        className="grid place-items-center h-12 w-12 rounded-full border border-dashed border-white/15 text-gold/40 shrink-0"
        aria-label={`Posición ${rank} vacía`}
      >
        <span className="font-heading text-sm tabular-nums">{rank}</span>
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn("relative shrink-0", isDragging && "z-10")}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${contestant.name}, posición ${rank}. Arrastra para reordenar.`}
        className={cn(
          "relative h-12 w-12 rounded-full overflow-hidden border-2 border-gold/60 cursor-grab active:cursor-grabbing touch-none",
          "transition-transform duration-200 hover:scale-[1.06]",
          isDragging && "shadow-glow-gold scale-[1.08]"
        )}
      >
        <Image
          src={contestant.image}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
        />
      </button>
      <span className="pointer-events-none absolute -top-1 -left-1 grid place-items-center h-5 w-5 rounded-full bg-gradient-gold text-primary text-[10px] font-bold shadow-glow-gold tabular-nums">
        {rank}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar a ${contestant.name}`}
          className="absolute -bottom-1 -right-1 grid place-items-center h-5 w-5 rounded-full bg-bg border border-white/20 text-text-muted hover:text-accent hover:border-accent/60 transition-colors"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </li>
  );
}
