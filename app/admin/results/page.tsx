import { ResultsForm } from "@/components/admin/ResultsForm";
import { getContestants } from "@/lib/data/contestants-server";
import { getAdminResults } from "@/lib/data/admin-results-server";

export const metadata = { title: "Admin · Resultados" };
export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const [contestants, state] = await Promise.all([
    getContestants(),
    getAdminResults(),
  ]);

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
          Resultados oficiales
        </p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
          Top 5 oficial.
        </h1>
        <p className="mt-3 text-text-secondary leading-relaxed">
          El orden es solo informativo; los aciertos se cuentan sin importar la
          posición.
        </p>
      </div>

      <div className="mt-10">
        <ResultsForm
          contestants={contestants}
          initialPicks={state.picks}
          publishedAt={state.publishedAt}
          updatedAt={state.updatedAt}
        />
      </div>
    </>
  );
}
