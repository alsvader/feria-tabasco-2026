import { Stepper } from "@/components/ui/Stepper";
import { ContestantGrid } from "@/components/selection/ContestantGrid";
import { Wordmark } from "@/components/ui/Wordmark";

export const metadata = { title: "Selección" };

export default function SeleccionPage() {
  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between gap-6">
          <Wordmark size="sm" />
          <Stepper current={1} />
          <span className="text-xs text-text-muted hidden sm:inline">
            Paso 1 de 3
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-14">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
            Selección
          </p>
          <h1 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
            Elige tus 5 favoritas.
          </h1>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Toca una candidata para añadirla. Arrastra las del podio para
            reordenar.
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <ContestantGrid />
        </div>
      </section>
    </main>
  );
}
