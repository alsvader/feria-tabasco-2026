"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, ReceiptText, Sparkles } from "lucide-react";
import { useRaffleStore, useHydratedRaffle, type Ticket } from "@/lib/store/raffle-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";

type Phase = "idle" | "processing" | "success" | "empty";

export function PaymentClient() {
  const router = useRouter();
  const hydrated = useHydratedRaffle();
  const selection = useRaffleStore((s) => s.selection);
  const purchaseTicket = useRaffleStore((s) => s.purchaseTicket);

  const [phase, setPhase] = useState<Phase>("idle");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const purchasedRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (purchasedRef.current) return;

    if (selection.length < 5) {
      setPhase("empty");
      const t = setTimeout(() => router.replace("/seleccion"), 1800);
      return () => clearTimeout(t);
    }

    purchasedRef.current = true;
    setPhase("processing");
    const t = setTimeout(() => {
      const created = purchaseTicket();
      if (created) {
        setTicket(created);
        setPhase("success");
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [hydrated, selection.length, purchaseTicket, router]);

  useEffect(() => {
    if (phase !== "success") return;
    const t = setTimeout(() => router.replace("/dashboard"), 3500);
    return () => clearTimeout(t);
  }, [phase, router]);

  if (phase === "empty") {
    return (
      <Card className="text-center max-w-md mx-auto">
        <p className="text-text-secondary">
          Tu selección está incompleta. Te llevamos de vuelta…
        </p>
      </Card>
    );
  }

  if (phase === "success" && ticket) {
    return <SuccessCard ticket={ticket} />;
  }

  return <ProcessingCard />;
}

function ProcessingCard() {
  return (
    <Card className="text-center max-w-md mx-auto py-14">
      <div className="grid place-items-center">
        <div
          aria-hidden
          className="relative h-16 w-16 grid place-items-center"
        >
          <span className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse-soft" />
          <Loader2
            size={36}
            strokeWidth={1.75}
            className="text-accent animate-spin relative"
          />
        </div>
      </div>
      <h1 className="mt-6 font-heading text-3xl tracking-tight">Procesando…</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Estamos asegurando tu boleto. No cierres esta ventana.
      </p>
      <ol
        className="mt-8 text-xs text-text-muted space-y-1.5"
        aria-live="polite"
      >
        <li>Verificando predicción</li>
        <li>Generando identificador único</li>
        <li>Asignando número en la bolsa</li>
      </ol>
    </Card>
  );
}

function SuccessCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card glow="gold" className="max-w-md mx-auto text-center">
      <div className="grid place-items-center">
        <div
          aria-hidden
          className="relative h-20 w-20 grid place-items-center animate-fade-in-up"
        >
          <span className="absolute inset-0 rounded-full bg-gold/30 blur-xl" />
          <div className="relative h-16 w-16 rounded-full bg-gradient-gold grid place-items-center shadow-glow-gold">
            <Check size={32} strokeWidth={2.5} className="text-primary" />
          </div>
        </div>
      </div>
      <p className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-gold">
        <Sparkles size={12} strokeWidth={2} />
        Compra confirmada
      </p>
      <h1 className="mt-3 font-heading text-3xl md:text-4xl tracking-tight">
        ¡Tu boleto está listo!
      </h1>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Guardamos tu predicción. Encuéntrala siempre en tu panel.
      </p>

      <div className="mt-7 rounded-2xl border border-gold/20 bg-surface-2/60 px-5 py-4 text-left">
        <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
          Identificador del boleto
        </p>
        <p className="mt-1 font-heading text-2xl tracking-tight text-gradient-gold">
          {ticket.id}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
          <span>Total cargado</span>
          <span className="tabular-nums text-text-primary">
            {formatCurrency(ticket.total)}
          </span>
        </div>
      </div>

      <Button asChild size="lg" className="w-full mt-7">
        <Link href="/dashboard">
          <ReceiptText size={16} strokeWidth={2} />
          Ver mis boletos
        </Link>
      </Button>
      <p className="mt-3 text-[11px] text-text-muted">
        Te llevaremos automáticamente en unos segundos…
      </p>
    </Card>
  );
}
