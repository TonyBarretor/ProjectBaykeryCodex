import "@/styles/globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ReactNode } from "react";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baykery.pe"),
  title: {
    template: "%s | Baykery",
    default: "Baykery – Panadería artesanal en Lima"
  },
  description:
    "Baykery ofrece panes y postres artesanales con delivery solo fines de semana en Lima. Reserva tu pedido para este sábado o domingo.",
  openGraph: {
    title: "Baykery",
    description:
      "Baykery ofrece panes y postres artesanales con delivery solo fines de semana en Lima.",
    locale: "es_PE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image"
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es-PE" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory-50">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
