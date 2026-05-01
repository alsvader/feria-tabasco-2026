import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Wordmark } from "@/components/ui/Wordmark";
import { getPrizePoolStats } from "@/lib/data/tickets-server";

export default async function LandingPage() {
  const { prizePool, ticketCount } = await getPrizePoolStats();
  return (
    <main className="min-h-[100dvh]">
      <SiteNav />
      <Hero prizePool={prizePool} ticketCount={ticketCount} />
      <HowItWorks />
      <SiteFooter />
    </main>
  );
}

function SiteNav() {
  return (
    <header className="absolute top-0 inset-x-0 z-30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between">
        <Wordmark />
        <div className="flex items-center gap-2">
          <Link
            href="/ranking"
            className="hidden sm:inline-flex items-center h-10 px-4 rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            Ranking
          </Link>
          <Link
            href="/resultados"
            className="hidden sm:inline-flex items-center h-10 px-4 rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            Resultados
          </Link>
          <Link
            href="/seleccion"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-gradient-brand text-white text-sm font-medium shadow-glow hover:scale-[1.02] hover:shadow-[0_0_36px_-4px_rgb(232_62_140/0.65)] transition-all duration-300"
          >
            Comprar boleto
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "X / Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" }
];

const footerCols = [
  {
    title: "Juego",
    links: [
      { label: "Comprar boleto", href: "/seleccion" },
      { label: "Mis boletos", href: "/dashboard" },
      { label: "Ranking", href: "/ranking" },
      { label: "Resultados", href: "/resultados" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Bases", href: "#" }
    ]
  },
  {
    title: "Comité",
    links: [
      { label: "Acerca de", href: "#" },
      { label: "Contacto", href: "#" },
      { label: "Prensa", href: "#" }
    ]
  }
];

function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 grid gap-12 lg:grid-cols-[1.4fr_2fr] items-start">
        <div>
          <Wordmark />
          <p className="mt-4 text-sm text-text-muted max-w-sm leading-relaxed">
            Rifa de predicción organizada por la afición. Sin relación oficial
            con el comité de la Feria. Mayores de edad.
          </p>
          <ul className="mt-6 flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  aria-label={s.label}
                  className="grid place-items-center h-10 w-10 rounded-full border border-white/10 bg-white/[0.03] text-text-secondary hover:text-text-primary hover:border-accent/40 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <s.icon size={16} strokeWidth={1.75} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-muted">
          <p>© 2026 · Embajadoras Feria Tabasco · Tabasco, México</p>
          <p>Pago demostrativo · ningún cargo real es procesado.</p>
        </div>
      </div>
    </footer>
  );
}
