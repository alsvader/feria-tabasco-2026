import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type Variant = "brand" | "gold" | "shimmer";

interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "h1" | "h2" | "h3" | "div";
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  brand: "text-gradient-brand",
  gold: "text-gradient-gold",
  shimmer: "shimmer-text"
};

export function GradientText({
  as: Comp = "span",
  variant = "brand",
  className,
  ...props
}: GradientTextProps) {
  return <Comp className={cn(variants[variant], className)} {...props} />;
}
