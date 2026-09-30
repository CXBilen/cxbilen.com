import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("renders an accessible toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("cycles from the system default through dark and light back to system", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveAccessibleName(/system/i);

    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");

    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).toHaveClass("light");

    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("system");
    expect(button).toHaveAccessibleName(/system/i);
  });

  it("resumes a saved light preference and returns to system on the next click", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(localStorage.getItem("theme")).toBe("system");
  });
});
