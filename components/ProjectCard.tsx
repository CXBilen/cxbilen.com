import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";
import type { Project } from "@/lib/projects";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="block h-full rounded-2xl outline-offset-4"
    >
      <Card className="h-full overflow-hidden transition-shadow hover:ring-1 hover:ring-ring/40">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b bg-muted">
          <Image
            src={project.cover}
            alt={project.coverAlt ?? `${project.title} interface`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          {project.status && (
            <p className="mb-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {project.status}
            </p>
          )}
          <CardTitle
            render={<h3 />}
            className="flex items-center justify-between gap-2"
          >
            {project.title}
            <ArrowUpRightIcon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </CardTitle>
          <CardDescription className="leading-relaxed">
            {project.tagline}
          </CardDescription>
        </CardHeader>
        <CardPanel className="flex items-end">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2">
                {tag}
              </Badge>
            ))}
          </div>
        </CardPanel>
      </Card>
    </Link>
  );
}
