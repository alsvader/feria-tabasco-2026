"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { findContestant } from "@/lib/data/contestants";
import { useRaffleStore, type Rank } from "@/lib/store/raffle-store";
import { SelectionSlot } from "@/components/selection/SelectionSlot";

const RANKS: Rank[] = [1, 2, 3, 4, 5];

export function SelectionStrip() {
  const selection = useRaffleStore((s) => s.selection);
  const reorder = useRaffleStore((s) => s.reorder);
  const removePick = useRaffleStore((s) => s.removePick);
  const clearSelection = useRaffleStore((s) => s.clearSelection);

  const filledCount = selection.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const fromRank = Number(String(active.id).replace("rank-", "")) as Rank;
    const toRank = Number(String(over.id).replace("rank-", "")) as Rank;
    if (!fromRank || !toRank) return;
    reorder(fromRank, toRank);
  };

  const slotsForContext = RANKS.map((r) => `rank-${r}`);

  return (
    <div
      className="flex items-center gap-3 sm:gap-5"
      role="region"
      aria-label="Tu Top 5"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={slotsForContext}
          strategy={horizontalListSortingStrategy}
        >
          <ol className="flex items-center gap-2 sm:gap-3">
            {RANKS.map((rank) => {
              const pick = selection.find((p) => p.rank === rank);
              const contestant = pick
                ? findContestant(pick.contestantId)
                : undefined;
              return (
                <SelectionSlot
                  key={rank}
                  rank={rank}
                  contestant={contestant}
                  onRemove={
                    pick ? () => removePick(pick.contestantId) : undefined
                  }
                />
              );
            })}
          </ol>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-xs uppercase tracking-[0.18em] text-text-muted tabular-nums">
          {filledCount}/5
        </span>
        {filledCount > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-text-muted hover:text-accent transition-colors"
          >
            Vaciar
          </button>
        )}
      </div>
    </div>
  );
}
