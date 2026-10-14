import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuewell — Trova chi sta già cercando quello che vendi",
  description:
    "Cuewell usa un'AI avanzata per trovare, su Hacker News e nei forum, le persone che stanno cercando quello che vendi — e te le porta ogni mattina con un punteggio d'intento.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
