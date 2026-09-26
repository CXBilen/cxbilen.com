import { describe, it, expect } from "vitest";
import { projects, getProject } from "@/lib/projects";

describe("projects data", () => {
  it("has the three selected projects with unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toEqual(["surfel", "cxbilen-com", "skywise"]);
    expect(new Set(slugs).size).toBe(3);
  });

  it("every project has a tagline, cover, and at least one section", () => {
    for (const p of projects) {
      expect(p.tagline.length).toBeGreaterThan(0);
      expect(p.cover.length).toBeGreaterThan(0);
      expect(p.sections.length).toBeGreaterThan(0);
    }
  });

  it("getProject returns by slug and undefined for unknown", () => {
    expect(getProject("skywise")?.title).toBe("SkyWise");
    expect(getProject("nope")).toBeUndefined();
  });
});
