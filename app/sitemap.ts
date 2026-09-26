import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE = "https://cxbilen.com";
const CONTENT_UPDATED = new Date("2026-09-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/cv"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: CONTENT_UPDATED,
  }));
  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: CONTENT_UPDATED,
  }));
  return [...staticRoutes, ...projectRoutes];
}
