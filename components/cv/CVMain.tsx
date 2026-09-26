import { cvData } from "@/lib/cv";

const linkClassName =
  "break-words underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

const headingClassName = "text-base font-semibold tracking-tight text-foreground";

export default function CVMain() {
  return (
    <article
      aria-labelledby="cv-name"
      className="flex min-w-0 flex-col gap-9 rounded-xl border bg-background p-6 text-sm leading-7 text-foreground sm:p-10"
    >
      <header className="flex flex-col gap-5 border-b pb-7">
        <div>
          <h1 id="cv-name" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {cvData.name}
          </h1>
          <p className="mt-2 text-base font-medium">{cvData.title}</p>
          <p className="text-muted-foreground">{cvData.subtitle}</p>
        </div>
        <address className="flex flex-col gap-1 not-italic text-muted-foreground">
          <p>{cvData.contact.location}</p>
          <p>
            <a className={linkClassName} href={`mailto:${cvData.contact.email}`}>
              {cvData.contact.email}
            </a>
          </p>
          <p>
            <a
              className={linkClassName}
              href={`tel:${cvData.contact.phone.replace(/\s/g, "")}`}
            >
              {cvData.contact.phone}
            </a>
          </p>
          {cvData.socials.map((social) => (
            <p key={social.label}>
              <span className="font-medium text-foreground">{social.label}: </span>
              <a className={linkClassName} href={social.href}>
                {social.href}
              </a>
            </p>
          ))}
        </address>
      </header>

      <section aria-labelledby="cv-summary" className="flex flex-col gap-3">
        <h2 id="cv-summary" className={headingClassName}>Summary</h2>
        <p className="text-muted-foreground">{cvData.about}</p>
      </section>

      <section aria-labelledby="cv-skills" className="flex flex-col gap-3">
        <h2 id="cv-skills" className={headingClassName}>Technical Skills</h2>
        <dl className="flex flex-col gap-3">
          <div>
            <dt className="font-medium">Technologies &amp; tools</dt>
            <dd className="text-muted-foreground">{cvData.tools.join(", ")}</dd>
          </div>
          <div>
            <dt className="font-medium">Engineering &amp; product</dt>
            <dd className="text-muted-foreground">{cvData.skills.join(", ")}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="cv-projects" className="flex flex-col gap-4">
        <h2 id="cv-projects" className={headingClassName}>Projects</h2>
        {cvData.selectedWork.map((project) => (
          <div key={project.name} className="flex flex-col gap-1">
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-muted-foreground">{project.desc}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="cv-experience" className="flex flex-col gap-5">
        <h2 id="cv-experience" className={headingClassName}>Experience</h2>
        {cvData.experience.map((experience) => (
          <div key={`${experience.company}-${experience.period}`} className="flex flex-col gap-1">
            <h3 className="font-medium">{experience.role}</h3>
            <p>{experience.company}</p>
            <p className="text-xs leading-6 text-muted-foreground">{experience.period}</p>
            {experience.body && <p className="text-muted-foreground">{experience.body}</p>}
          </div>
        ))}
      </section>

      <section aria-labelledby="cv-education" className="flex flex-col gap-5">
        <h2 id="cv-education" className={headingClassName}>Education</h2>
        {cvData.education.map((education) => (
          <div key={education.title} className="flex flex-col gap-1">
            <h3 className="font-medium">{education.title}</h3>
            <p>{education.org}</p>
            <p className="text-xs leading-6 text-muted-foreground">{education.period}</p>
            {education.body && <p className="text-muted-foreground">{education.body}</p>}
          </div>
        ))}
      </section>
    </article>
  );
}
