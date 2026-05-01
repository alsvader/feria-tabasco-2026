"use client";

import { useState } from "react";
import { AlertCircle, Check, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TicketCard } from "@/components/dashboard/TicketCard";
import { formatDate } from "@/lib/utils/format";
import type { Contestant } from "@/lib/data/contestants";
import type { AdminTicketRow } from "@/lib/data/admin-tickets-server";

export function AdminTicketsClient({
  pendingTickets,
  contestants
}: {
  pendingTickets: AdminTicketRow[];
  contestants: Contestant[];
}) {
  const [tickets, setTickets] = useState(pendingTickets);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmedCount, setConfirmedCount] = useState(0);

  const contestantsById = new Map(contestants.map((c) => [c.id, c]));

  const handleConfirm = async (id: string) => {
    if (confirming) return;
    setConfirming(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tickets/${id}/confirm`, {
        method: "POST"
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No pudimos confirmar el boleto.");
        if (res.status === 409) {
          setTickets((prev) => prev.filter((t) => t.id !== id));
        }
        return;
      }
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setConfirmedCount((n) => n + 1);
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setConfirming(null);
    }
  };

  if (tickets.length === 0) {
    return (
      <Card className="text-center py-14">
        <div className="grid place-items-center">
          <div className="relative h-16 w-16 grid place-items-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl"
            />
            <div className="relative h-14 w-14 rounded-full bg-emerald-400/10 border border-emerald-400/30 grid place-items-center">
              <Check size={22} strokeWidth={2.25} className="text-emerald-300" />
            </div>
          </div>
        </div>
        <h2 className="mt-6 font-heading text-2xl tracking-tight">
          No hay pagos pendientes
        </h2>
        <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
          {confirmedCount > 0
            ? `Confirmaste ${confirmedCount} ${confirmedCount === 1 ? "boleto" : "boletos"} en esta sesión.`
            : "Todo al día. Vuelve cuando lleguen nuevos boletos."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-text-primary"
        >
          <AlertCircle
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-accent"
          />
          <span>{error}</span>
        </div>
      )}
      <ol className="space-y-4">
        {tickets.map((t) => (
          <li key={t.id} className="space-y-3">
            <TicketCard
              ticket={{
                id: t.id,
                picks: t.picks,
                total: t.total,
                status: t.status,
                createdAt: t.createdAt
              }}
              contestantsById={contestantsById}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/[0.06] bg-surface/60 px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary min-w-0">
                <Mail
                  size={14}
                  strokeWidth={1.75}
                  className="shrink-0 text-text-muted"
                />
                <span className="truncate">{t.email ?? "—"}</span>
                <span className="text-text-muted">·</span>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {formatDate(t.createdAt)}
                </span>
              </div>
              <Button
                variant="gold"
                size="md"
                onClick={() => handleConfirm(t.id)}
                disabled={confirming === t.id}
              >
                <Check size={14} strokeWidth={2} />
                {confirming === t.id ? "Confirmando…" : "Confirmar pago"}
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
