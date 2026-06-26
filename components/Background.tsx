export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top"
      style={{ backgroundImage: "var(--bgimg)" }}
    />
  );
}
