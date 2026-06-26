import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function CaseStudy({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-16">
      <Link
        href="/work"
        className="text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← All work
      </Link>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        {project.role} · {project.year}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-heading sm:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-body">{project.tagline}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted"
            style={{ borderColor: "var(--line)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-[22px]">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-bold text-accent">The problem</h2>
        <p className="mt-2 leading-relaxed text-body">{project.problem}</p>
      </section>

      {project.sections.map((s) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-2xl font-bold text-heading">{s.heading}</h2>
          <p className="mt-2 leading-relaxed text-body">{s.body}</p>
        </section>
      ))}

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {project.gallery.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src={src}
              alt={`${project.title} visual ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
