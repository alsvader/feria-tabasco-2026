import { cn } from "@/lib/utils/cn";
import { forwardRef, type HTMLAttributes } from "react";

type Glow = "none" | "pink" | "gold";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: Glow;
  padded?: boolean;
}

const glowMap: Record<Glow, string> = {
  none: "",
  pink: "shadow-glow",
  gold: "shadow-glow-gold"
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, glow = "none", padded = true, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative bg-surface rounded-3xl border border-white/[0.06]",
        "shadow-surface backdrop-blur-sm",
        padded && "p-6 md:p-8",
        glowMap[glow],
        className
      )}
      {...props}
    />
  );
});
