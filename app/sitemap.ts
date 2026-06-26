import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE = "https://cxbilen.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/cv"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-06-26"),
  }));
  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: new Date("2026-06-26"),
  }));
  return [...staticRoutes, ...projectRoutes];
}
