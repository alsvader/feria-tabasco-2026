"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TICKET_PRICE, TICKET_FEE, TICKET_TOTAL } from "@/lib/store/raffle-store";
import { formatCurrency } from "@/lib/utils/format";
import { PaymentMethods } from "@/components/review/PaymentMethods";

export function PriceBreakdown({ canContinue }: { canContinue: boolean }) {
  return (
    <Card glow="pink" className="lg:sticky lg:top-24">
      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
        Resumen
      </p>
      <h2 className="mt-2 font-heading text-2xl tracking-tight">Tu boleto</h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-text-secondary">Boleto base</dt>
          <dd className="tabular-nums">{formatCurrency(TICKET_PRICE)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-text-secondary">Comisión de servicio</dt>
          <dd className="tabular-nums">{formatCurrency(TICKET_FEE)}</dd>
        </div>
        <div className="h-px bg-white/[0.08] my-3" />
        <div className="flex items-center justify-between">
          <dt className="font-semibold">Total</dt>
          <dd className="font-heading text-3xl text-gradient-gold tabular-nums">
            {formatCurrency(TICKET_TOTAL)}
          </dd>
        </div>
      </dl>

      <Button
        asChild={canContinue}
        size="lg"
        disabled={!canContinue}
        className="w-full mt-8"
      >
        {canContinue ? (
          <Link href="/pago">
            Ir a pagar
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        ) : (
          <span>Completa tu Top 5</span>
        )}
      </Button>

      <div className="mt-6 pt-6 border-t border-white/[0.06]">
        <PaymentMethods />
      </div>

      <p className="mt-5 flex items-start gap-2 text-[11px] text-text-muted leading-relaxed">
        <ShieldCheck
          size={14}
          strokeWidth={1.75}
          className="text-gold/80 shrink-0 mt-px"
        />
        Pago demostrativo. Tu predicción se guarda localmente al confirmar.
      </p>
    </Card>
  );
}
