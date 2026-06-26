"use client";

import { useTheme } from "next-themes";

const DARK = "/cv/Cem Bilen CV 2026 Dark.pdf";
const LIGHT = "/cv/Cem Bilen CV 2026 Light.pdf";

export default function DownloadCV() {
  const { resolvedTheme } = useTheme();
  const href = resolvedTheme === "dark" ? DARK : LIGHT;
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      Download PDF
    </a>
  );
}
