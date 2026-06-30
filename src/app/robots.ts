import type { MetadataRoute } from "next";

// Canonical origin — same source of truth as layout.tsx / sitemap.ts.
const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://smart-stay-navy.vercel.app"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/owner-dashboard", "/settings", "/favorites"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
