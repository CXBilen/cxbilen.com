export default function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[22px] border backdrop-blur-md ${className}`}
      style={{
        background: "var(--card)",
        borderColor: "var(--cardborder)",
        boxShadow: "var(--cardshadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
