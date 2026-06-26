import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes home, work, cv, and every project", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://cxbilen.com");
    expect(urls).toContain("https://cxbilen.com/work");
    expect(urls).toContain("https://cxbilen.com/cv");
    expect(urls).toContain("https://cxbilen.com/work/looplift");
    expect(urls).toContain("https://cxbilen.com/work/ux-sentinel");
    expect(urls).toContain("https://cxbilen.com/work/maestro");
  });
});
