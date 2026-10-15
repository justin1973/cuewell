import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuewell — Find people already looking for what you sell",
  description:
    "Cuewell uses advanced AI to find, on Hacker News and in forums, the people searching for what you sell — and brings them to your inbox each morning with an intent score.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
