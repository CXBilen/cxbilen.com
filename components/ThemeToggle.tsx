"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
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
  const Icon =
    currentTheme === "system"
      ? MonitorIcon
      : currentTheme === "dark"
        ? MoonIcon
        : SunIcon;
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
