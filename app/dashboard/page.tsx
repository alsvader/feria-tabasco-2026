import Link from "next/link";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Wordmark } from "@/components/ui/Wordmark";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getContestants } from "@/lib/data/contestants-server";
import { getMyTickets, getPrizePoolStats } from "@/lib/data/tickets-server";
import {
  getMyTicketScores,
  getPublicWinners
} from "@/lib/data/results-server";

export const metadata = { title: "Mis boletos" };

export default async function DashboardPage() {
  const [contestants, tickets, { prizePool }, scores, winners] =
    await Promise.all([
      getContestants(),
      getMyTickets(),
      getPrizePoolStats(),
      getMyTicketScores(),
      getPublicWinners()
    ]);
  const winnerTicketIds = new Set(winners.map((w) => w.ticketId));

  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between">
          <Wordmark size="sm" />
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/ranking"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Ranking
            </Link>
            <Link
              href="/resultados"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Resultados
            </Link>
            <Link
              href="/seleccion"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Participantes
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 py-12 md:py-16">
        <DashboardClient
          contestants={contestants}
          tickets={tickets}
          prizePool={prizePool}
          scores={scores}
          winnerTicketIds={winnerTicketIds}
        />
      </section>
    </main>
  );
}
