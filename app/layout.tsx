import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: "Embajadoras Feria Tabasco 2026",
    template: "%s · Feria Tabasco 2026"
  },
  description:
    "Predice el Top 5 de Embajadoras Feria Tabasco 2026 y participa por la bolsa acumulada.",
  openGraph: {
    title: "Embajadoras Feria Tabasco 2026",
    description:
      "Elige a tus 5 favoritas en orden y gana la bolsa acumulada de la rifa.",
    type: "website",
    locale: "es_MX"
  }
};

export const viewport: Viewport = {
  themeColor: "#0f0a1a",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="min-h-[100dvh] bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
