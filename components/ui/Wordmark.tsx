import Link from "next/link";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Props {
  size?: "sm" | "md";
  className?: string;
}

export function Wordmark({ size = "md", className }: Props) {
  const text = size === "sm" ? "text-sm" : "text-base sm:text-lg";
  const disc = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const iconSize = size === "sm" ? 11 : 13;

  return (
    <Link
      href="/"
      className={cn(
        "font-heading tracking-[0.22em] uppercase flex items-center gap-2.5",
        text,
        className
      )}
      aria-label="Embajadoras Feria Tabasco 2026 — inicio"
    >
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-full bg-gradient-gold text-primary shadow-glow-gold",
          disc
        )}
      >
        <Crown size={iconSize} strokeWidth={2.25} />
      </span>
      Embajadoras
    </Link>
  );
}
