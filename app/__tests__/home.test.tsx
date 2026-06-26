import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("shows the name and all three projects", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /cem bilen/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Looplift")).toBeInTheDocument();
    expect(screen.getByText("UX Sentinel")).toBeInTheDocument();
    expect(screen.getByText("Maestro")).toBeInTheDocument();
  });
});
