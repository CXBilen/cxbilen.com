export default function SectionHeading({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="material-symbols-outlined text-[22px] text-accent">
        {icon}
      </span>
      <h2 className="text-xl font-bold text-heading">{children}</h2>
    </div>
  );
}
