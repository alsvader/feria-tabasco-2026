import { ShieldCheck } from "lucide-react";

const methods = [
  { name: "Visa", style: "italic font-bold tracking-tight text-base" },
  { name: "Mastercard", style: "font-semibold tracking-tight" },
  { name: "AMEX", style: "font-bold tracking-[0.18em] text-[11px]" },
  { name: "SPEI", style: "font-bold tracking-[0.18em] text-[11px]" }
] as const;

export function PaymentMethods() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
        Métodos aceptados
      </p>
      <ul className="mt-3 flex flex-wrap items-center gap-2">
        {methods.map((m) => (
          <li
            key={m.name}
            className="inline-flex items-center justify-center h-9 min-w-[3.75rem] px-3 rounded-lg border border-white/10 bg-white/[0.03] text-text-secondary"
          >
            <span className={m.style}>{m.name}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-text-muted">
        <ShieldCheck size={12} strokeWidth={1.75} className="text-gold/80" />
        Encriptado de extremo a extremo
      </p>
    </div>
  );
}
