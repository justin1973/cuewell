import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { GAListener } from "@/components/ga-listener";
import "./globals.css";

const GA_ID = "G-EYDTYE375X";
const GA_ON = process.env.NODE_ENV === "production";

const SITE = "https://cuewell.io";
const DESC =
  "Cuewell uses AI to find, on Hacker News, Lobsters and Stack Exchange, the people searching for what you sell — and brings them to your inbox with an intent score.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Cuewell — Find people already looking for what you sell",
    template: "%s · Cuewell",
  },
  description: DESC,
  keywords: [
    "lead generation", "intent data", "social listening", "buying intent",
    "find customers", "Hacker News leads", "AI lead generation", "sales prospecting",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Cuewell",
    title: "Cuewell — Find people already looking for what you sell",
    description: DESC,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuewell — Find people already looking for what you sell",
    description: DESC,
  },
  robots: { index: true, follow: true },
  verification: { google: "Zf1VSqT4skqW5MtLZlqJumVm6Og-0paH8UL2hGmPU-o" },
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
      <body>
        {children}

        {GA_ON && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });`}
            </Script>
            <Suspense fallback={null}>
              <GAListener gaId={GA_ID} />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
