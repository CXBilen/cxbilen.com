import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected full-stack development, frontend engineering and product work by Cem Bilen.",
};

export default function WorkIndex() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Selected Work
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Full-stack applications, interfaces and the engineering decisions
            behind them.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
