"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LayerMask01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const currentTheme =
    mounted && (theme === "dark" || theme === "light") ? theme : "system";
  const nextTheme =
    currentTheme === "system"
      ? "dark"
      : currentTheme === "dark"
        ? "light"
        : "system";
  const labels = { system: "System", dark: "Dark", light: "Light" };
  const label = `Toggle theme: ${labels[currentTheme]}. Switch to ${labels[nextTheme]}.`;
  return (
    <Button
      className="relative size-8"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
    >
      <HugeiconsIcon
        aria-hidden="true"
        className="size-4 -rotate-45"
        icon={LayerMask01Icon}
        strokeWidth={2}
      />
    </Button>
  );
}
