import Card from "@/components/Card";
import { cvData } from "@/lib/cv";

function IconRow({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-body">
      <span className="material-symbols-outlined text-[17px] text-accent">
        {icon}
      </span>
      {children}
    </div>
  );
}

function Grid({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-accent">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-heading">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {items.map((i) => (
          <span key={i} className="text-xs font-medium text-body">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-7 sm:w-[260px] sm:flex-none">
      <Card className="p-7">
        <div className="mb-5 flex justify-center">
          <div
            className="h-[90px] w-[90px] rounded-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/photo.jpg')",
              border: "3px solid var(--ring)",
            }}
          />
        </div>
        <div className="text-xl font-bold text-heading">{cvData.name}</div>
        <div className="mt-1 text-sm font-bold text-accent">{cvData.title}</div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {cvData.subtitle}
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <IconRow icon="mail">{cvData.contact.email}</IconRow>
          <IconRow icon="call">{cvData.contact.phone}</IconRow>
          <IconRow icon="location_on">{cvData.contact.location}</IconRow>
        </div>
      </Card>

      <Grid title="Skills" icon="psychology" items={cvData.skills} />
      <Grid title="Tools" icon="build" items={cvData.tools} />

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        {cvData.socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between border-b py-3 text-sm font-medium text-social transition-colors hover:text-accent"
            style={{ borderColor: "var(--line)" }}
          >
            {s.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
