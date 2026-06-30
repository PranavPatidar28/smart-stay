import type { MetadataRoute } from "next";

// Canonical origin — same source of truth as layout.tsx. Driven from the env
// (set in Vercel) so the sitemap, robots, and metadata never point at
// different domains.
const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://smart-stay-navy.vercel.app"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only publicly indexable pages. Auth-gated routes (favorites, settings,
  // owner-dashboard) are intentionally excluded — they require a session and
  // shouldn't be advertised to crawlers.
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/listings", changeFrequency: "hourly", priority: 0.9 },
    { path: "/auth/signin", changeFrequency: "monthly", priority: 0.6 },
    { path: "/auth/signup", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
