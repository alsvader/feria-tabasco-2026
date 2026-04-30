import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "pink" | "gold";
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, accent = "pink", hint }: Props) {
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className={cn(
          "absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl pointer-events-none",
          accent === "gold" ? "bg-gold/15" : "bg-accent/15"
        )}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
            {label}
          </p>
          <p
            className={cn(
              "mt-3 font-heading text-4xl md:text-5xl tracking-tight tabular-nums leading-none",
              accent === "gold" ? "text-gradient-gold" : "text-text-primary"
            )}
          >
            {value}
          </p>
          {hint && (
            <p className="mt-3 text-xs text-text-secondary">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "grid place-items-center h-11 w-11 rounded-2xl border",
            accent === "gold"
              ? "bg-gold/10 border-gold/30 text-gold"
              : "bg-accent/10 border-accent/30 text-accent"
          )}
        >
          <Icon size={18} strokeWidth={1.75} />
        </div>
      </div>
    </Card>
  );
}
