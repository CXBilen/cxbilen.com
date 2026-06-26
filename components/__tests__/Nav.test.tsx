import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThemeProvider from "@/components/ThemeProvider";
import Nav from "@/components/Nav";

describe("Nav", () => {
  it("links to home, work, and cv", () => {
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
    );
    expect(screen.getByRole("link", { name: /work/i })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getByRole("link", { name: /cv/i })).toHaveAttribute(
      "href",
      "/cv",
    );
  });
});
