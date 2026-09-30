"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ContrastIcon } from "lucide-react";
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
      {currentTheme === "system" ? (
        <ContrastIcon aria-hidden="true" className="size-4" strokeWidth={2} />
      ) : (
        <HugeiconsIcon
          aria-hidden="true"
          className="size-4"
          icon={currentTheme === "dark" ? Moon02Icon : Sun03Icon}
          strokeWidth={2}
        />
      )}
    </Button>
  );
}
