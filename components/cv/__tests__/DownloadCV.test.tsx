import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import DownloadCV from "@/components/cv/DownloadCV";

const downloads = [
  { name: "Download PDF", href: "/cv/Cem Bilen CV 2026.pdf" },
  { name: "DOCX", href: "/cv/Cem Bilen CV 2026.docx" },
  { name: "TXT", href: "/cv/Cem Bilen CV 2026.txt" },
];

describe("DownloadCV", () => {
  it("offers the canonical PDF, Word and plain-text files as downloads", () => {
    render(<DownloadCV />);

    for (const { name, href } of downloads) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("download");
    }
  });

  it.each(["light", "dark"])(
    "preserves the server download links when hydrating in %s theme",
    async (theme) => {
      const container = document.createElement("div");
      container.innerHTML = renderToString(<DownloadCV />);
      const serverHrefs = Array.from(container.querySelectorAll("a"), (link) =>
        link.getAttribute("href"),
      );
      expect(serverHrefs).toEqual(downloads.map(({ href }) => href));

      document.body.appendChild(container);
      const previousTheme = document.documentElement.getAttribute("class");
      document.documentElement.setAttribute("class", theme);
      const hydrationWarnings = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      let root: Root | undefined;

      try {
        await act(async () => {
          root = hydrateRoot(container, <DownloadCV />);
        });
        expect(
          Array.from(container.querySelectorAll("a"), (link) =>
            link.getAttribute("href"),
          ),
        ).toEqual(serverHrefs);
        expect(hydrationWarnings).not.toHaveBeenCalled();
      } finally {
        await act(async () => {
          root?.unmount();
        });
        container.remove();
        if (previousTheme === null)
          document.documentElement.removeAttribute("class");
        else document.documentElement.setAttribute("class", previousTheme);
        hydrationWarnings.mockRestore();
      }
    },
  );
});
