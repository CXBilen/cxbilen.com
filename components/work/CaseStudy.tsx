import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects";

export default function CaseStudy({ project }: { project: Project }) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12 sm:py-16">
      <div>
        <Button variant="ghost" size="sm" render={<Link href="/work" />}>
          <ArrowLeftIcon aria-hidden="true" />
          All work
        </Button>
      </div>
      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          {project.role} · {project.year}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        {project.status && (
          <p className="text-sm font-medium">{project.status}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        {project.links && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.links.map((link) => (
              <Button
                key={link.href}
                variant="outline"
                render={
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                {link.label}
                <ArrowUpRightIcon aria-hidden="true" />
              </Button>
            ))}
          </div>
        )}
      </header>
      <figure className="flex flex-col gap-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted">
          <Image
            src={project.cover}
            alt={`${project.title} interface`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 767px) 100vw, 720px"
          />
        </div>
        {project.imageNote && (
          <figcaption className="text-xs leading-relaxed text-muted-foreground">
            {project.imageNote}
          </figcaption>
        )}
      </figure>
      <section className="flex flex-col gap-3 border-t pt-8">
        <h2 className="text-xl font-semibold tracking-tight">The problem</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.problem}
        </p>
      </section>
      {project.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            {section.heading}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {section.body}
          </p>
        </section>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        {project.gallery.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted"
          >
            <Image
              src={src}
              alt={`${project.title} visual ${i + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 639px) 100vw, 360px"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
