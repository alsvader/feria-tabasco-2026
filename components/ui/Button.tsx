import { Slot } from "@/components/ui/Slot";
import { cn } from "@/lib/utils/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full select-none " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out " +
  "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-glow hover:scale-[1.02] hover:shadow-[0_0_36px_-4px_rgb(232_62_140/0.65)]",
  secondary:
    "bg-surface/80 backdrop-blur border border-secondary/40 text-text-primary " +
    "hover:border-accent/70 hover:bg-surface hover:scale-[1.01]",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-white/5",
  gold:
    "bg-gradient-gold text-primary shadow-glow-gold hover:scale-[1.02]"
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref as never}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
