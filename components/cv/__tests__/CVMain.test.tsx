import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CVMain from "@/components/cv/CVMain";

describe("CVMain", () => {
  it("renders experience entries", () => {
    render(<CVMain />);
    expect(screen.getByText(/Efsora Labs/i)).toBeInTheDocument();
    expect(screen.getByText(/Digital House/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Senior UX Engineer/i).length).toBeGreaterThan(
      0,
    );
  });
});
