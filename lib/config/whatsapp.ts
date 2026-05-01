import type { Ticket } from "@/lib/raffle/types";
import type { Contestant } from "@/lib/data/contestants";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export const WHATSAPP_PHONE = "+525588063606";

export function buildWhatsAppPaymentUrl(
  ticket: Ticket,
  dashboardUrl: string,
  contestants: Contestant[]
): string {
  const byId = new Map(contestants.map((c) => [c.id, c]));
  const ordered = ticket.picks.slice().sort((a, b) => a.rank - b.rank);
  const picks = ordered
    .map((p) => {
      const c = byId.get(p.contestantId);
      return c ? `${p.rank}. ${c.name} · ${c.ciudad}` : null;
    })
    .filter((line): line is string => line !== null);

  const body = [
    "Hola, quiero pagar mi boleto para Embajadoras Feria Tabasco 2026.",
    "",
    `Boleto: ${ticket.id}`,
    `Fecha: ${formatDate(ticket.createdAt)}`,
    `Total: ${formatCurrency(ticket.total)}`,
    "",
    "Mi Top 5:",
    ...picks,
    "",
    `Dashboard: ${dashboardUrl}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(body)}`;
}
