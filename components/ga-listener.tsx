"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Sends a GA4 page_view on every route change (App Router client navigations
// don't reload the page, so we track them ourselves).
export function GAListener({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag !== "function") return;
    const query = searchParams?.toString();
    const path = pathname + (query ? `?${query}` : "");
    w.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}
