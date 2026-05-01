import { listAdminTickets } from "@/lib/data/admin-tickets-server";
import { getContestants } from "@/lib/data/contestants-server";
import { AdminTicketsClient } from "@/components/admin/AdminTicketsClient";

export const metadata = { title: "Admin · Confirmaciones" };
export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const [pendingTickets, contestants] = await Promise.all([
    listAdminTickets("pending"),
    getContestants()
  ]);

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
          Confirmaciones
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
          Pagos pendientes.
        </h1>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Marca como confirmados los boletos cuyo pago por WhatsApp ya recibiste.
        </p>
      </div>

      <div className="mt-10">
        <AdminTicketsClient
          pendingTickets={pendingTickets}
          contestants={contestants}
        />
      </div>
    </>
  );
}
