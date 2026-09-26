const links = [
  { label: "Email", href: "mailto:CXBilen@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/cxbilen" },
  { label: "GitHub", href: "https://github.com/CXBilen" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Izmir, Türkiye · © 2026 Cem Bilen
        </p>
        <div className="flex gap-6 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
