import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CaseStudy from "@/components/work/CaseStudy";
import { getProject } from "@/lib/projects";

describe("CaseStudy", () => {
  it("renders the project title, tagline, and section headings", () => {
    const project = getProject("ux-sentinel")!;
    render(<CaseStudy project={project} />);
    expect(
      screen.getByRole("heading", { name: "UX Sentinel", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(project.tagline)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Process" }),
    ).toBeInTheDocument();
  });
});
