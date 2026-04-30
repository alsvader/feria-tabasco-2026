import Image from "next/image";
import { CheckSquare, CreditCard, ListOrdered, Trophy } from "lucide-react";

const steps = [
  {
    icon: ListOrdered,
    title: "Arma tu Top 5",
    body:
      "Recorre las candidatas y selecciona a tus cinco favoritas en el orden que crees ganador."
  },
  {
    icon: CheckSquare,
    title: "Confirma tu predicción",
    body:
      "Revisa el orden y verifica que cada puesto refleje exactamente tu pronóstico."
  },
  {
    icon: CreditCard,
    title: "Asegura tu boleto",
    body:
      "Paga el boleto y obtén un identificador único asociado a tu predicción."
  },
  {
    icon: Trophy,
    title: "Gana la bolsa",
    body:
      "Quien tenga la predicción más cercana al resultado oficial se lleva la bolsa acumulada."
  }
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-start">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-text-muted">
            La mecánica
          </div>
          <h2 className="mt-3 font-heading text-4xl md:text-5xl tracking-tight">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed max-w-xl">
            Sin registros, sin esperas. Compras un boleto y tu predicción queda
            en firme hasta el día de la coronación.
          </p>

          <ol className="mt-10 flex flex-col gap-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-glow"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand-soft border border-white/10">
                  <step.icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-accent"
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-sm text-gold/80 tabular-nums">
                      0{i + 1}
                    </span>
                    <h3 className="font-heading text-xl tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-surface-lg">
            <Image
              src="https://picsum.photos/seed/feria-tab-howitworks/640/800"
              alt="Coronación Feria Tabasco 2026"
              fill
              sizes="(min-width: 1024px) 24rem, 60vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-brand-soft mix-blend-overlay pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/50 to-transparent pointer-events-none"
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold/90">
                Coronación 2026
              </p>
              <p className="mt-2 font-heading text-2xl tracking-tight leading-tight max-w-[18ch]">
                Una nueva embajadora para Tabasco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
