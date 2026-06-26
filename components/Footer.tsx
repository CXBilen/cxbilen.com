import Link from "next/link";

const links = [
  { label: "Email", href: "mailto:cem@cxbilen.com", icon: "mail" },
  { label: "LinkedIn", href: "https://linkedin.com/in/cxbilen", icon: "link" },
  { label: "GitHub", href: "https://github.com/CXBilen", icon: "code" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Izmir, Türkiye · © 2026 Cem Bilen</p>
        <div className="flex gap-5 text-sm font-medium text-social">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="flex items-center gap-2 transition-colors hover:text-accent"
            >
              <span className="material-symbols-outlined text-[18px]">
                {l.icon}
              </span>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
