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
};

const PLACEHOLDER = "/images/placeholder-cover.svg";
const LOREM =
  "Placeholder content. Replace with the real story: context, constraints, and the decisions that shaped the outcome.";

export const projects: Project[] = [
  {
    slug: "looplift",
    title: "Looplift",
    tagline: "AI-assisted UX experimentation & product-growth concept.",
    tags: ["AI", "UX", "Product Growth"],
    cover: PLACEHOLDER,
    year: "2026",
    role: "Product Design · UX Engineering",
    problem: LOREM,
    sections: [
      { heading: "Context", body: LOREM },
      { heading: "Process", body: LOREM },
      { heading: "Outcome", body: LOREM },
    ],
    gallery: [PLACEHOLDER, PLACEHOLDER],
  },
  {
    slug: "ux-sentinel",
    title: "UX Sentinel",
    tagline: "UX-to-code, design-system & AI-agent exploration.",
    tags: ["Design Systems", "UX-to-Code", "AI Agents"],
    cover: PLACEHOLDER,
    year: "2025",
    role: "Product Design · UX Engineering",
    problem: LOREM,
    sections: [
      { heading: "Context", body: LOREM },
      { heading: "Process", body: LOREM },
      { heading: "Outcome", body: LOREM },
    ],
    gallery: [PLACEHOLDER, PLACEHOLDER],
  },
  {
    slug: "maestro",
    title: "Maestro",
    tagline: "Web-app architecture, AI workflows & user-facing product.",
    tags: ["Web App", "AI Workflows", "Product"],
    cover: PLACEHOLDER,
    year: "2025",
    role: "Product Design · UX Engineering",
    problem: LOREM,
    sections: [
      { heading: "Context", body: LOREM },
      { heading: "Process", body: LOREM },
      { heading: "Outcome", body: LOREM },
    ],
    gallery: [PLACEHOLDER, PLACEHOLDER],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
