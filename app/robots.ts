import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/reset-password"],
    },
    sitemap: "https://cuewell.io/sitemap.xml",
    host: "https://cuewell.io",
  };
}
