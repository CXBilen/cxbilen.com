import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("shows the name and selected development projects", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /cem bilen/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Surfel")).toBeInTheDocument();
    expect(screen.getByText("cxbilen.com")).toBeInTheDocument();
    expect(screen.getByText("SkyWise")).toBeInTheDocument();
    expect(screen.getByText("Dev Migration Assistant")).toBeInTheDocument();
    expect(screen.getByText("PlayAgain")).toBeInTheDocument();
    expect(screen.getByText("LENZ")).toBeInTheDocument();
    expect(screen.getByText("Looplift")).toBeInTheDocument();
    expect(screen.getByText("Maestro")).toBeInTheDocument();
    expect(screen.getByText("ZEDrift")).toBeInTheDocument();
    expect(screen.getByText("01 — 09")).toBeInTheDocument();
  });
});
