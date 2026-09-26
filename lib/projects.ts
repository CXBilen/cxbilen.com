export type CaseSection = { heading: string; body: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  cover: string;
  year: string;
  role: string;
  problem: string;
  sections: CaseSection[];
  gallery: string[];
  status?: string;
  imageNote?: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "surfel",
    title: "Surfel",
    tagline: "Building the application and infrastructure behind an e-commerce product for AI agents.",
    tags: ["Full-stack", "TypeScript", "PostgreSQL"],
    cover: "/images/work/surfel-sites-light.png",
    year: "2026",
    role: "Product engineering · Full-stack development · UX",
    status: "In development",
    imageNote: "Prototype UI with sample data.",
    problem:
      "E-commerce shops need a controlled way to make their existing journeys usable by AI agents. I'm building Surfel around that problem, connecting product decisions and merchant workflows with the application, data and infrastructure they require.",
    sections: [
      {
        heading: "Engineering",
        body: "The implementation spans a TypeScript and Next.js monorepo, customer and operator applications, PostgreSQL data models, authentication and role-based access. Server APIs, webhook handling, sandbox billing integration and background job processing sit alongside the frontend.",
      },
      {
        heading: "Process",
        body: "I use AI coding tools within a documented development process: define the scope, record architectural decisions, implement bounded changes, then review and verify them. Automated checks cover application code, database policies and browser behavior. The interface adapts COSS components into a shared system for navigation, forms and operational states.",
      },
      {
        heading: "Current state",
        body: "The application, identity, data and infrastructure foundations are implemented. The merchant activation and agent execution journey remains in development. The gallery shows interface prototypes with example organizations and sample data.",
      },
    ],
    gallery: [
      "/images/work/surfel-sites-light.png",
      "/images/work/surfel-sites-dark.png",
      "/images/work/surfel-installation.png",
    ],
    links: [{ label: "Surfel website", href: "https://surfel.io" }],
  },
  {
    slug: "cxbilen-com",
    title: "cxbilen.com",
    tagline: "A portfolio and CV built with reusable React components and a shared theme system.",
    tags: ["Next.js", "React", "Frontend"],
    cover: "/images/work/portfolio-coss-dark.png",
    year: "2026",
    role: "Frontend engineering · Design system · Content",
    status: "Live · Personal project",
    problem:
      "My portfolio and CV need to explain the same professional story across project pages, mobile layouts and downloadable documents. I built a single Next.js application with shared content, components and visual rules.",
    sections: [
      {
        heading: "Engineering",
        body: "React and TypeScript power the portfolio routes, reusable cards, navigation and CV. CSS variables and Tailwind share color and typography rules across light and dark themes. COSS supplies the default design tokens and component patterns. A single content source produces the web CV and single-column PDF, DOCX and text downloads, while route metadata and the sitemap support discoverability.",
      },
      {
        heading: "Process",
        body: "I translate content and layout needs into reusable components, then check the rendered pages at desktop and mobile sizes. Component tests and production builds support changes to navigation, theme behavior and project content.",
      },
      {
        heading: "Source",
        body: "The site is live and its source is public. It brings implementation, project documentation and the CV together in an application I maintain directly.",
      },
    ],
    gallery: ["/images/work/portfolio-coss-dark.png", "/images/work/portfolio-coss-light.png"],
    links: [
      { label: "Visit website", href: "https://cxbilen.com" },
      { label: "View source", href: "https://github.com/CXBilen/cxbilen.com" },
    ],
  },
  {
    slug: "skywise",
    title: "SkyWise",
    tagline: "A travel assistant case study that turns user journeys into an interactive Next.js prototype.",
    tags: ["Next.js", "TypeScript", "Product UX"],
    cover: "/images/work/skywise-chat.png",
    year: "2026",
    role: "Product design · Frontend development · Prototyping",
    status: "Case study · Interactive prototype",
    imageNote: "Prototype with sample data and simulated integrations.",
    problem:
      "Planning a trip involves choosing flights, checking calendar conflicts and organizing travel details. I developed this Efsora case study to make those decisions understandable, with clear onboarding, review steps and recovery paths.",
    sections: [
      {
        heading: "Engineering",
        body: "The prototype uses Next.js, React, TypeScript and Tailwind, with reusable UI components for onboarding, conversation, flight choices, imports and trip management. Demo API routes and state transitions make the flows interactive. Authentication, flight booking and calendar integrations are simulated.",
      },
      {
        heading: "Process",
        body: "I broke the product scenario into user flows, desktop and mobile layouts, and explicit loading, error, confirmation and undo states. Design files, HTML screen variants and flow diagrams accompany the coded prototype so behavior and presentation can be reviewed together.",
      },
      {
        heading: "Source",
        body: "The public repository contains the application, case study documents and Figma file. This is an interactive case study using sample data; its assistant behavior demonstrates the proposed experience through rule-based intent handling.",
      },
    ],
    gallery: [
      "/images/work/skywise-chat.png",
      "/images/work/skywise-onboarding.png",
      "/images/work/skywise-import.png",
    ],
    links: [{ label: "View source and case study", href: "https://github.com/CXBilen/skywise" }],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
