import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import { projects } from "@/lib/projects";
import { cvData } from "@/lib/cv";

const capabilities = [
  {
    title: "Frontend engineering",
    body: "Responsive React and Next.js interfaces, reusable components and design systems. Clear interactions across loading, empty, error and success states.",
  },
  {
    title: "Backend & integrations",
    body: "Application logic, APIs, relational data models, authentication and access control. Connecting the interface to the services and data it depends on.",
  },
  {
    title: "AI-native development",
    body: "AI agents are part of how I explore, implement, debug and review. I define the requirements, evaluate technical choices and verify the result with tests and real usage flows.",
  },
  {
    title: "UX & conversion",
    body: "Experience in SaaS UX, funnel analysis and A/B testing helps me make engineering decisions around usability, product goals and measurable hypotheses.",
  },
];

export default function Home() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pb-20 sm:gap-20">
        <Hero />
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <SectionHeading>Selected Work</SectionHeading>
            <span className="font-mono text-xs text-muted-foreground">
              01 — {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <SectionHeading>What I build</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <Card key={capability.title}>
                <CardHeader>
                  <CardTitle render={<h3 />}>{capability.title}</CardTitle>
                </CardHeader>
                <CardPanel>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {capability.body}
                  </p>
                </CardPanel>
              </Card>
            ))}
          </div>
        </section>
        <section className="grid gap-6 border-t pt-12 sm:grid-cols-[1fr_2fr] sm:gap-12">
          <SectionHeading>Engineering with product context</SectionHeading>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>{cvData.about}</p>
            <p>
              My background starts with database programming and a Computer
              Programming degree, followed by web development, SaaS UX and CRO
              roles. Today, I bring those skills together through full-stack
              product development.
            </p>
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <SectionHeading>How I work</SectionHeading>
          <ol className="grid divide-y rounded-2xl border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              [
                "Define the problem",
                "Map the user flow, constraints, data and acceptance criteria before implementation.",
              ],
              [
                "Build in focused steps",
                "Break the work into reviewable changes, use AI to support development, and keep interfaces and application logic aligned.",
              ],
              [
                "Verify and document",
                "Check critical paths, error states and responsive behavior, then document decisions and the next steps.",
              ],
            ].map(([title, body], i) => (
              <li key={title} className="flex flex-col gap-3 p-6">
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <div className="pt-2">
            <Button size="lg" render={<a href="mailto:CXBilen@gmail.com" />}>
              Discuss a project <ArrowUpRightIcon aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
