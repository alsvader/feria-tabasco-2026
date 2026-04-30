import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, id, ...props },
  ref
) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs uppercase tracking-[0.18em] text-text-muted"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          "h-12 px-4 rounded-2xl bg-surface-2/70 border border-white/10",
          "text-text-primary placeholder:text-text-muted/60",
          "transition-colors duration-200",
          "focus:outline-none focus:border-accent/70 focus:bg-surface-2",
          "aria-[invalid=true]:border-accent",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-accent">{error}</span>
      )}
    </div>
  );
});
