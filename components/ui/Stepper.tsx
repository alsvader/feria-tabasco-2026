import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  { id: 1, label: "Selección" },
  { id: 2, label: "Revisión" },
  { id: 3, label: "Pago" }
] as const;

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav
      aria-label="Progreso de compra"
      className="w-full max-w-2xl mx-auto"
    >
      <ol className="flex items-center justify-between gap-2 sm:gap-4">
        {STEPS.map((step, i) => {
          const isComplete = step.id < current;
          const isActive = step.id === current;
          return (
            <li
              key={step.id}
              className="flex items-center gap-3 sm:gap-4 flex-1 last:flex-none min-w-0"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={cn(
                  "flex items-center gap-3 min-w-0",
                  !isActive && !isComplete && "opacity-60"
                )}
              >
                <span
                  className={cn(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300",
                    isActive &&
                      "bg-gradient-brand text-white border-transparent shadow-glow",
                    isComplete &&
                      "bg-gold/15 text-gold border-gold/40",
                    !isActive &&
                      !isComplete &&
                      "border-white/10 text-text-secondary bg-surface"
                  )}
                  aria-hidden
                >
                  {isComplete ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    step.id
                  )}
                </span>
                <span
                  className={cn(
                    "hidden sm:inline text-sm font-medium tracking-wide truncate",
                    isActive ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1 transition-colors duration-500",
                    step.id < current
                      ? "bg-gradient-to-r from-gold/60 to-accent/60"
                      : "bg-white/10"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
