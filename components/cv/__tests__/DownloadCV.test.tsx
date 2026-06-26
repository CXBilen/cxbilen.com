import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DownloadCV from "@/components/cv/DownloadCV";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}));

describe("DownloadCV", () => {
  it("links to the dark PDF in dark theme", () => {
    render(<DownloadCV />);
    const link = screen.getByRole("link", { name: /download pdf/i });
    expect(link.getAttribute("href")).toContain("Dark.pdf");
    expect(link).toHaveAttribute("download");
  });
});
