import { Stepper } from "@/components/ui/Stepper";
import { ReviewClient } from "@/components/review/ReviewClient";
import { Wordmark } from "@/components/ui/Wordmark";
import { getContestants } from "@/lib/data/contestants-server";

export const metadata = { title: "Revisión" };

export default async function RevisionPage() {
  const contestants = await getContestants();
  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between gap-6">
          <Wordmark size="sm" />
          <Stepper current={2} />
          <span className="text-xs text-text-muted hidden sm:inline">
            Paso 2 de 3
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-16">
        <ReviewClient contestants={contestants} />
      </section>
    </main>
  );
}
