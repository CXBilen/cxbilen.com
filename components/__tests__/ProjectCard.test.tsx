import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "@/components/ProjectCard";
import { getProject } from "@/lib/projects";

describe("ProjectCard", () => {
  it("renders title and links to the case study", () => {
    const project = getProject("surfel")!;
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Surfel")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/work/surfel");
  });
});
