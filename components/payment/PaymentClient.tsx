"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  MessageCircle,
  ReceiptText,
  Sparkles
} from "lucide-react";
import {
  useRaffleStore,
  useHydratedRaffle,
  type Ticket
} from "@/lib/store/raffle-store";
import type { Contestant } from "@/lib/data/contestants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { buildWhatsAppPaymentUrl } from "@/lib/config/whatsapp";

type Phase = "idle" | "sent" | "empty";

export function PaymentClient({ contestants }: { contestants: Contestant[] }) {
  const router = useRouter();
  const hydrated = useHydratedRaffle();
  const selection = useRaffleStore((s) => s.selection);
  const purchaseTicket = useRaffleStore((s) => s.purchaseTicket);

  const [phase, setPhase] = useState<Phase>("idle");
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (phase !== "idle") return;
    if (ticket) return;
    if (selection.length < 5) {
      setPhase("empty");
      const t = setTimeout(() => router.replace("/seleccion"), 1800);
      return () => clearTimeout(t);
    }
  }, [hydrated, selection.length, phase, ticket, router]);

  const openWhatsApp = (t: Ticket) => {
    const dashboardUrl = `${window.location.origin}/dashboard`;
    window.open(
      buildWhatsAppPaymentUrl(t, dashboardUrl, contestants),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePay = () => {
    if (!hydrated || phase !== "idle") return;
    const created = purchaseTicket();
    if (!created) return;
    setTicket(created);
    setPhase("sent");
    openWhatsApp(created);
  };

  const handleResend = () => {
    if (ticket) openWhatsApp(ticket);
  };

  if (phase === "empty") {
    return (
      <Card className="text-center max-w-md mx-auto">
        <p className="text-text-secondary">
          Tu selección está incompleta. Te llevamos de vuelta…
        </p>
      </Card>
    );
  }

  if (phase === "sent" && ticket) {
    return <SentCard ticket={ticket} onResend={handleResend} />;
  }

  return <PayCard onPay={handlePay} />;
}

function PayCard({ onPay }: { onPay: () => void }) {
  return (
    <Card glow="pink" className="max-w-md mx-auto text-center">
      <div className="grid place-items-center">
        <div
          aria-hidden
          className="relative h-20 w-20 grid place-items-center"
        >
          <span className="absolute inset-0 rounded-full bg-accent/25 blur-xl animate-pulse-soft" />
          <div className="relative h-16 w-16 rounded-full bg-gradient-brand grid place-items-center shadow-glow">
            <MessageCircle size={28} strokeWidth={2} className="text-white" />
          </div>
        </div>
      </div>
      <p className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-accent">
        <Sparkles size={12} strokeWidth={2} />
        Último paso
      </p>
      <h1 className="mt-3 font-heading text-3xl md:text-4xl tracking-tight">
        Completa tu pago por WhatsApp.
      </h1>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Te abriremos un chat con el comité con tu boleto, predicción y monto a
        cubrir. La confirmación llega por el mismo medio.
      </p>
      <Button onClick={onPay} size="lg" className="w-full mt-7">
        <MessageCircle size={16} strokeWidth={2} />
        Pagar por WhatsApp
        <ArrowRight size={16} strokeWidth={2} />
      </Button>
      <p className="mt-3 text-[11px] text-text-muted">
        El boleto se reserva al abrir WhatsApp.
      </p>
    </Card>
  );
}

function SentCard({
  ticket,
  onResend
}: {
  ticket: Ticket;
  onResend: () => void;
}) {
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
        Esperando confirmación
      </p>
      <h1 className="mt-3 font-heading text-3xl md:text-4xl tracking-tight">
        Mensaje enviado a WhatsApp.
      </h1>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Termina el pago en la conversación. Recibirás la confirmación por el
        mismo chat.
      </p>

      <div className="mt-7 rounded-2xl border border-gold/20 bg-surface-2/60 px-5 py-4 text-left">
        <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
          Identificador del boleto
        </p>
        <p className="mt-1 font-heading text-2xl tracking-tight text-gradient-gold">
          {ticket.id}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
          <span>Total a pagar</span>
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
      <button
        type="button"
        onClick={onResend}
        className="mt-3 text-[11px] text-text-muted hover:text-accent transition-colors"
      >
        Volver a abrir WhatsApp
      </button>
    </Card>
  );
}
