import SectionHeading from "@/components/SectionHeading";
import { cvData } from "@/lib/cv";

export default function CVMain() {
  return (
    <main className="min-w-0 flex-1">
      <section>
        <SectionHeading icon="person">About me</SectionHeading>
        <p className="text-sm leading-relaxed text-body">{cvData.about}</p>
      </section>

      <section className="mt-7">
        <SectionHeading icon="work">Experience</SectionHeading>
        <div className="flex flex-col gap-4">
          {cvData.experience.map((e) => (
            <div key={`${e.company}-${e.period}`}>
              <div className="text-sm font-bold text-accent">
                {e.role}
                <span className="font-semibold text-body"> @ {e.company}</span>
              </div>
              <div className="mt-0.5 text-xs font-medium text-muted">
                {e.period}
              </div>
              {e.body && (
                <p className="mt-1 text-xs leading-relaxed text-body">
                  {e.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionHeading icon="school">Education</SectionHeading>
        <div className="flex flex-col gap-4">
          {cvData.education.map((e) => (
            <div key={e.title}>
              <div className="text-sm font-bold text-accent">
                {e.title}
                <span className="font-semibold text-body"> @ {e.org}</span>
              </div>
              <div className="mt-0.5 text-xs font-medium text-muted">
                {e.period}
              </div>
              {e.body && (
                <p className="mt-1 text-xs leading-relaxed text-body">
                  {e.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionHeading icon="star">Selected Work</SectionHeading>
        <div className="flex flex-col gap-2">
          {cvData.selectedWork.map((w) => (
            <div key={w.name} className="flex gap-2 text-xs">
              <span className="font-bold text-accent">{w.name}</span>
              <span className="text-body">— {w.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
