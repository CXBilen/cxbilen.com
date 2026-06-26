import Background from "@/components/Background";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import Card from "@/components/Card";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <>
      <Background />
      <Hero />
      <section className="mx-auto max-w-5xl px-6">
        <SectionHeading icon="star">Selected Work</SectionHeading>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section className="mx-auto mt-20 max-w-5xl px-6">
        <SectionHeading icon="person">About</SectionHeading>
        <Card className="mt-4 p-6">
          <p className="text-base leading-relaxed text-body">
            Product Designer and Senior UX Engineer with 5+ years across consumer
            and SaaS products. I pair design systems and experimentation-driven
            CRO with hands-on front-end execution, so product decisions are fast
            to test, build, and improve.
          </p>
        </Card>
      </section>
      <Footer />
    </>
  );
}
