import Link from "next/link";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Wordmark } from "@/components/ui/Wordmark";

export const metadata = { title: "Mis boletos" };

export default function DashboardPage() {
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
              href="/seleccion"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Participantes
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 py-12 md:py-16">
        <DashboardClient />
      </section>
    </main>
  );
}
