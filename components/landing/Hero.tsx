import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { PrizePoolCard } from "@/components/landing/PrizePoolCard";

export function Hero({
  prizePool,
  ticketCount
}: {
  prizePool: number;
  ticketCount: number;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div
        aria-hidden
        className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-accent/30 blur-3xl pointer-events-none animate-pulse-soft"
      />
      <div
        aria-hidden
        className="absolute top-40 -left-24 h-[380px] w-[380px] rounded-full bg-secondary/35 blur-3xl pointer-events-none animate-pulse-soft"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[320px] w-[600px] rounded-full bg-gold/10 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-text-secondary">
              <Crown size={12} strokeWidth={2} className="text-gold" />
              Edición 2026
            </div>
            <h1 className="mt-6 font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Elige tus{" "}
              <GradientText as="span" variant="gold">
                5
              </GradientText>{" "}
              favoritas
              <br />
              y gana la bolsa acumulada.
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-text-secondary leading-relaxed">
              Predice el Top 5 de las Embajadoras de la Feria Tabasco 2026 en el
              orden correcto. Quien acierte —o se acerque más— se lleva la bolsa
              acumulada.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/seleccion">
                  Elegir mis 5 favoritas
                  <ArrowRight size={18} strokeWidth={2} />
                </Link>
              </Button>
            </div>
            <div className="mt-8 max-w-md">
              <PrizePoolCard prizePool={prizePool} ticketCount={ticketCount} />
            </div>
          </div>

          <div
            className="relative lg:justify-self-end w-full max-w-md aspect-[4/5] animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[2.5rem] bg-gradient-brand-soft blur-3xl pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-[2rem] bg-gold/10 blur-2xl pointer-events-none animate-pulse-soft"
            />
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-gold/30 shadow-glow-gold">
              <Image
                src="https://picsum.photos/seed/feria-tab-queen-hero/800/1000"
                alt="Embajadora Feria Tabasco 2026"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 80vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/30 to-transparent pointer-events-none"
              />
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-bg/60 backdrop-blur-md border border-gold/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold">
                <Crown size={11} strokeWidth={2.25} />
                17 candidatas
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
