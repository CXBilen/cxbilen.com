import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import Card from "@/components/Card";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <Card className="overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-heading">{project.title}</h3>
          <p className="mt-1 text-sm text-body">{project.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
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
        </div>
      </Card>
    </Link>
  );
}
