import type { Metadata } from "next";
import Background from "@/components/Background";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected product design and UX engineering work.",
};

export default function WorkIndex() {
  return (
    <>
      <Background />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-16">
        <SectionHeading icon="star">Selected Work</SectionHeading>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </main>
    </>
  );
}
