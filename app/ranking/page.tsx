import Link from "next/link";
import { RankingClient } from "@/components/ranking/RankingClient";
import { Wordmark } from "@/components/ui/Wordmark";
import { getContestants } from "@/lib/data/contestants-server";

export const metadata = { title: "Ranking" };

export default async function RankingPage() {
  const contestants = await getContestants();
  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between">
          <Wordmark size="sm" />
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Mis boletos
            </Link>
            <Link
              href="/seleccion"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Participantes
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 lg:px-10 py-12 md:py-16">
        <RankingClient contestants={contestants} />
      </section>
    </main>
  );
}
