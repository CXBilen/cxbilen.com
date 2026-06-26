import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        Product Designer · Senior UX Engineer
      </p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight text-heading sm:text-6xl">
        Cem Bilen
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
        I own product surfaces end-to-end — from ambiguous requirements to
        polished, shipped UI — pairing design systems and experimentation-driven
        CRO with hands-on front-end execution.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/work"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          View work
        </Link>
        <Link
          href="/cv"
          className="rounded-full border px-6 py-3 text-sm font-semibold text-heading transition-colors hover:text-accent"
          style={{ borderColor: "var(--line)" }}
        >
          View CV
        </Link>
      </div>
    </section>
  );
}
