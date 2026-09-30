export type CaseSection = { heading: string; body: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  cover: string;
  coverAlt?: string;
  year: string;
  role: string;
  problem: string;
  sections: CaseSection[];
  gallery: string[];
  imageCaptions?: Record<string, string>;
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
    imageNote: "Account screens from the live application and earlier interface prototypes with sample data.",
    problem:
      "E-commerce shops need a controlled way to make their existing journeys usable by AI agents. I'm building Surfel around that problem, connecting product decisions and merchant workflows with the application, data and infrastructure they require.",
    sections: [
      {
        heading: "Engineering",
        body: "The implementation spans a TypeScript and Next.js monorepo, customer and operator applications, PostgreSQL data models, authentication and role-based access. Server APIs, webhook handling, sandbox billing integration and background job processing sit alongside the frontend.",
      },
      {
        heading: "Process",
        body: "I use AI coding tools within a documented development process: define the scope, record architectural decisions, implement bounded changes, then review and verify them. Automated checks cover application code, database policies and browser behavior. The interface uses a shared component system for navigation, forms and operational states.",
      },
      {
        heading: "Current state",
        body: "The application, identity, data and infrastructure foundations are implemented. The merchant activation and agent execution journey remains in development. The gallery combines live site and plan interfaces with earlier prototypes using example organizations and sample data.",
      },
    ],
    gallery: [
      "/images/work/surfel-sites-light.png",
      "/images/work/surfel-sites-dark.png",
      "/images/work/surfel-installation.png",
      "/images/work/surfel-live-sites.png",
      "/images/work/surfel-live-billing.png",
    ],
    imageCaptions: {
      "/images/work/surfel-sites-light.png": "Site management prototype in the light theme; sample data.",
      "/images/work/surfel-sites-dark.png": "Site management prototype in the dark theme; sample data.",
      "/images/work/surfel-installation.png": "Integration setup prototype; sample data.",
      "/images/work/surfel-live-sites.png": "Site management in the live account; no sites added in this view.",
      "/images/work/surfel-live-billing.png": "Live plan interface showing an unavailable current plan state.",
    },
    links: [{ label: "Surfel website", href: "https://surfel.io" }],
  },
  {
    slug: "cxbilen-com",
    title: "cxbilen.com",
    tagline: "A portfolio and CV built with reusable React components and a shared theme system.",
    tags: ["Next.js", "React", "Frontend"],
    cover: "/images/work/portfolio-dark.png",
    year: "2026",
    role: "Frontend engineering · Design system · Content",
    status: "Live · Personal project",
    problem:
      "My portfolio and CV need to explain the same professional story across project pages, mobile layouts and downloadable documents. I built a single Next.js application with shared content, components and visual rules.",
    sections: [
      {
        heading: "Engineering",
        body: "React and TypeScript power the portfolio routes, reusable cards, navigation and CV. CSS variables and Tailwind share color and typography rules across light and dark themes. Design tokens and reusable component patterns keep the interface consistent. A single content source produces the web CV and single-column PDF, DOCX and text downloads, while route metadata and the sitemap support discoverability.",
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
    gallery: [
      "/images/work/portfolio-dark.png",
      "/images/work/portfolio-light.png",
      "/images/work/portfolio-mobile.png",
      "/images/work/portfolio-work.png",
      "/images/work/portfolio-cv.png",
    ],
    imageCaptions: {
      "/images/work/portfolio-dark.png": "Personal website in the dark theme on desktop.",
      "/images/work/portfolio-light.png": "Personal website in the light theme on desktop.",
      "/images/work/portfolio-mobile.png": "Responsive personal website on a 390 px mobile viewport.",
      "/images/work/portfolio-work.png": "Project overview from the website at desktop size.",
      "/images/work/portfolio-cv.png": "Web CV with the shared professional content and download options.",
    },
    links: [
      { label: "Visit website", href: "https://cxbilen.com" },
      { label: "View source", href: "https://github.com/CXBilen/cxbilen.com" },
    ],
  },
  {
    slug: "dev-migration-assistant",
    title: "Dev Migration Assistant",
    tagline: "An encrypted macOS backup tool for Git working state, local project files and AI coding context.",
    tags: ["Electron", "TypeScript", "Node.js"],
    cover: "/images/work/dev-migration-home.png",
    year: "2026",
    role: "Desktop engineering · Application architecture · Developer tooling",
    status: "Open source · macOS release v1.0.0",
    imageNote: "Early development preview screenshots from the public repository.",
    problem:
      "Moving to another Mac can leave behind uncommitted code, Git worktrees, local configuration and AI coding sessions. I built Dev Migration Assistant to capture that working context in one encrypted archive and restore it with a reviewable plan for the destination machine.",
    sections: [
      {
        heading: "Engineering",
        body: "An Electron application pairs a React and TypeScript interface with Node.js backup and restore engines. A typed IPC boundary connects the interface to native dialogs and filesystem operations. Separate providers collect Git state, Claude Code context, selected project files and runtime information, while the archive layer streams data through Argon2id key derivation and AES-256-GCM encryption.",
      },
      {
        heading: "Restore and verification",
        body: "The restore workflow inspects the archive, maps project locations, checks conflicts and shows the planned writes before execution. Path remapping, checksum verification and scoped filesystem access support the migration. Unit tests, integration tests using real Git repositories and Playwright Electron checks accompany documented architecture and backup format decisions.",
      },
      {
        heading: "Source and release",
        body: "The MIT-licensed source and v1.0.0 release are public on GitHub. The application targets macOS on Apple Silicon and keeps backup processing local. The images show an earlier interface preview; the repository documents the released backup and restore implementation.",
      },
    ],
    gallery: [
      "/images/work/dev-migration-home.png",
      "/images/work/dev-migration-backup.png",
      "/images/work/dev-migration-restore.png",
      "/images/work/dev-migration-diagnostics.png",
    ],
    imageCaptions: {
      "/images/work/dev-migration-home.png": "Home screen from the early development preview.",
      "/images/work/dev-migration-backup.png": "Project selection in the backup wizard; development preview.",
      "/images/work/dev-migration-restore.png": "Opening an archive in the restore wizard; development preview.",
      "/images/work/dev-migration-diagnostics.png": "Application and provider diagnostics; development preview.",
    },
    links: [
      { label: "View source", href: "https://github.com/CXBilen/dev-migration-assistant" },
      { label: "Download macOS release", href: "https://github.com/CXBilen/dev-migration-assistant/releases/tag/v1.0.0" },
    ],
  },
  {
    slug: "playagain",
    title: "PlayAgain",
    tagline: "A browser gaming application that connects a TV or desktop screen with phones as controllers.",
    tags: ["Next.js", "WebRTC", "WebSockets"],
    cover: "/images/work/playagain-01-canli-ana-sayfa.png",
    year: "2026",
    role: "Full-stack engineering · Realtime systems · Interaction design",
    status: "Web application · Personal project",
    imageNote: "Live website, host room, paired phone controller and built-in Demo Arena, captured in September 2026.",
    problem:
      "Playing together across a shared screen and personal phones requires a clear pairing flow, responsive input and reliable connection handling. I built PlayAgain around a host screen, mobile controllers and browser-based emulation, bringing those separate device roles into one application.",
    sections: [
      {
        heading: "Engineering",
        body: "Next.js and TypeScript provide the host, controller and API routes. Browser clients handle emulation, rendering and audio; the realtime layer connects room membership and controller input through WebSockets, WebRTC and Redis pub/sub. QR pairing, room tokens, input protocols and connection state management support the interaction between devices.",
      },
      {
        heading: "Device experience",
        body: "The host interface supports large screens and gamepad navigation, while the mobile interface provides touch controls and paired gamepad input. A controller-run mode lets the phone run the emulator and stream video and audio to the host. Authentication, Google Drive library routes and save-state handling sit alongside the gameplay interface.",
      },
      {
        heading: "Verification",
        body: "The repository includes tests for binary input protocols, connection state, host and controller behavior, and transport switching. The screenshots show the live landing page, host room, paired phone controller and the built-in controller demo.",
      },
    ],
    gallery: [
      "/images/work/playagain-01-canli-ana-sayfa.png",
      "/images/work/playagain-02-canli-host-lobi.png",
      "/images/work/playagain-03-canli-telefon-kumandasi.png",
      "/images/work/playagain-04-canli-demo-arena.png",
    ],
    imageCaptions: {
      "/images/work/playagain-01-canli-ana-sayfa.png": "Current product landing page on the live website.",
      "/images/work/playagain-02-canli-host-lobi.png": "Live host room with QR pairing and console choices.",
      "/images/work/playagain-03-canli-telefon-kumandasi.png": "Phone controller paired to the live room over WebSocket.",
      "/images/work/playagain-04-canli-demo-arena.png": "Built-in Demo Arena for testing controller input.",
    },
    links: [{ label: "Visit PlayAgain", href: "https://www.playagain.app" }],
  },
  {
    slug: "looplift",
    title: "Looplift",
    tagline: "An AI-assisted experimentation platform connecting storefront audits, variant generation and A/B testing.",
    tags: ["Full-stack", "AI workflows", "CRO"],
    cover: "/images/work/looplift-overview-dark.png",
    year: "2026",
    role: "Full-stack engineering · AI workflows · Conversion optimization",
    status: "Private beta",
    imageNote: "Account screens from the owner's store and the public landing page, captured in September 2026. Landing page experiment data is illustrative.",
    problem:
      "Shopify merchants need to turn conversion findings into experiments they can review, launch and evaluate. I built Looplift around that workflow, connecting evidence collection, AI-assisted recommendations, generated variants and explicit human approval.",
    sections: [
      {
        heading: "Engineering",
        body: "The Next.js and TypeScript application uses Supabase for authentication and PostgreSQL data. An audit pipeline collects storefront evidence, analyzes pages and synthesizes findings. Variant generation produces versioned declarative patch sets, while an experiment lifecycle connects approval, delivery, measurement, guardrails and rollback.",
      },
      {
        heading: "Product decisions",
        body: "Opportunities persist as distinct product records so audits and proposals can build on the same finding. Merchants review each generated change before launch. The interface brings audits, reviewed variants and experiment states together.",
      },
      {
        heading: "Current state",
        body: "The project is in private beta. The audit-to-launch workflow and experiment controls are implemented. The documented evidence has not yet established a statistically conclusive experiment or a proven learning loop; those outcomes need further usage and validation.",
      },
    ],
    gallery: [
      "/images/work/looplift-overview-dark.png",
      "/images/work/looplift-overview-light.png",
      "/images/work/looplift-audit-findings.png",
      "/images/work/looplift-experiments.png",
      "/images/work/looplift-home.png",
    ],
    imageCaptions: {
      "/images/work/looplift-overview-dark.png": "Owner's store overview in the dark theme; no running tests or shipped winners.",
      "/images/work/looplift-overview-light.png": "The same store overview in the light theme.",
      "/images/work/looplift-audit-findings.png": "Recorded audit findings for the owner's store.",
      "/images/work/looplift-experiments.png": "Experiment list with setup and concluded states; no shipped winners.",
      "/images/work/looplift-home.png": "Public landing page with an illustrative experiment example.",
    },
    links: [{ label: "Visit Looplift", href: "https://www.looplift.io" }],
  },
  {
    slug: "maestro",
    title: "Maestro",
    tagline: "A project workspace for agent execution, streamed output and reviewable engineering artifacts.",
    tags: ["AI agents", "Bun", "PostgreSQL"],
    cover: "/images/work/maestro-architecture.svg",
    coverAlt: "Maestro architecture: Next.js workspace, Bun worker, agent execution, PostgreSQL and Redis Streams",
    year: "2026",
    role: "Application architecture · Agent orchestration · Full-stack engineering",
    status: "Engineering project · Private source",
    imageNote: "Local product and sign-in interfaces, alongside an architecture diagram based on the repository implementation.",
    problem:
      "AI-generated work needs project context, execution state and a place to review the result. I developed Maestro as a workspace that connects project goals to agent runs, streamed output, persisted artifacts and review decisions.",
    sections: [
      {
        heading: "Engineering",
        body: "A Next.js and TypeScript workspace connects to a Bun worker and execution adapters. PostgreSQL stores project and run records, while Redis supports streams, locks and queue operations. Authenticated server routes stream execution output through Server-Sent Events, keeping the interface connected to the worker lifecycle.",
      },
      {
        heading: "Execution and review",
        body: "The orchestration layer defines explicit transitions from creation and scoping through execution, generated output and review. Shared contracts connect job types, runners, logs and artifacts. Review actions let a person approve, edit or reject the resulting work, with state transitions represented in the application.",
      },
      {
        heading: "Project scope",
        body: "The repository includes component generation, UX audit and design-system job types, workspace management and infrastructure configuration. This case study presents the implemented application structure and execution workflow. The cover illustrates those system boundaries.",
      },
    ],
    gallery: [
      "/images/work/maestro-architecture.svg",
      "/images/work/maestro-workflow-desktop.png",
      "/images/work/maestro-login-dark.png",
      "/images/work/maestro-login-mobile.png",
    ],
    imageCaptions: {
      "/images/work/maestro-architecture.svg": "Implementation architecture diagram; this is not an application screenshot.",
      "/images/work/maestro-workflow-desktop.png": "Product workflow section from the local application.",
      "/images/work/maestro-login-dark.png": "Local account sign-in interface in the dark theme.",
      "/images/work/maestro-login-mobile.png": "Local account sign-in interface on mobile.",
    },
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
      "/images/work/skywise-flight-choice.png",
      "/images/work/skywise-flight-choice-mobile.png",
      "/images/work/skywise-trip-management.png",
    ],
    imageCaptions: {
      "/images/work/skywise-chat.png": "Travel assistant prototype with sample conversations.",
      "/images/work/skywise-onboarding.png": "Onboarding flow from the interactive prototype.",
      "/images/work/skywise-import.png": "Travel import flow with simulated integration data.",
      "/images/work/skywise-flight-choice.png": "Desktop flight selection in the local application using sample flights.",
      "/images/work/skywise-flight-choice-mobile.png": "The same flight selection flow on mobile; sample flights.",
      "/images/work/skywise-trip-management.png": "Trip management in the local application; sample trips and calendar states.",
    },
    links: [{ label: "View source and case study", href: "https://github.com/CXBilen/skywise" }],
  },
  {
    slug: "lenz",
    title: "LENZ",
    tagline: "An AI virtual try-on application connecting a shopping interface with image generation and merchant APIs.",
    tags: ["Full-stack", "Generative AI", "Supabase"],
    cover: "/images/work/lenz-home-desktop.png",
    year: "2025",
    role: "Full-stack development · AI integration · E-commerce UX",
    status: "Live website · Personal project",
    imageNote: "Public website and try-on selection flow, captured in September 2026.",
    problem:
      "Virtual try-on needs more than an image generation screen: shoppers need a clear photo and garment flow, while merchants need authentication, usage controls and an integration surface. I built Lenz to connect that user experience with the application logic and services behind it.",
    sections: [
      {
        heading: "Engineering",
        body: "The application uses Next.js, React and TypeScript with Supabase for identity and relational data. Server routes assemble photo and garment inputs for Google Gemini image generation. Merchant API routes add API authentication, request validation, rate limiting, billing checks and usage tracking around the try-on workflow.",
      },
      {
        heading: "Product workflows",
        body: "The frontend covers photo capture, garment selection, generated results and try-on history. The codebase also contains merchant widgets, Shopify integration routes and Polar billing webhooks. These application boundaries connect the shopping experience to merchant configuration and account operations.",
      },
      {
        heading: "Current presentation",
        body: "The public website introduces the try-on product and provides account and demo entry points. The implementation connects the try-on interface, image generation routes and merchant account operations in one application.",
      },
    ],
    gallery: [
      "/images/work/lenz-home-desktop.png",
      "/images/work/lenz-tryon-product-step.png",
      "/images/work/lenz-tryon-link-mobile.png",
    ],
    imageCaptions: {
      "/images/work/lenz-home-desktop.png": "Current public virtual try-on product landing page.",
      "/images/work/lenz-tryon-product-step.png": "Product image selection in the public try-on demo.",
      "/images/work/lenz-tryon-link-mobile.png": "Garment URL input in the public demo on mobile.",
    },
    links: [{ label: "Visit Lenz", href: "https://lenz.style" }],
  },
  {
    slug: "zedrift",
    title: "ZEDrift",
    tagline: "A browser-based 3D driving game with procedural city generation and realtime multiplayer state.",
    tags: ["Three.js", "Socket.IO", "Node.js"],
    cover: "/images/work/zedrift-city-plan.png",
    coverAlt: "ZEDrift city map asset showing streets and buildings from above",
    year: "2025",
    role: "3D frontend development · Realtime backend · Game interactions",
    status: "Game project · Private source",
    imageNote: "Local account interfaces and the repository's city map asset. The game server was offline during capture.",
    problem:
      "A multiplayer driving game must connect a responsive local scene with shared player state and understandable controls. I built ZEDrift around a browser-rendered city, drift and boost interactions, and a Node.js server that coordinates the connected players.",
    sections: [
      {
        heading: "Rendering and interaction",
        body: "React, TypeScript and Three.js form the browser client. Separate modules handle procedural city generation, driving and drift physics, gravity and tire marks. The interface combines a game HUD, player list, chat, minimap and connection states around the rendered scene.",
      },
      {
        heading: "Realtime backend",
        body: "An Express and Socket.IO server manages gameplay connections and multiplayer events. PostgreSQL and Prisma support account data, with JWT and Google OAuth authentication. Client and server applications have their own container and Fly.io configuration.",
      },
      {
        heading: "Project scope",
        body: "The source separates rendering and game physics from server-side account and connection handling. The cover is a city map asset used by the project; it shows the spatial setting behind the driving experience.",
      },
    ],
    gallery: [
      "/images/work/zedrift-city-plan.png",
      "/images/work/zedrift-login-desktop.png",
      "/images/work/zedrift-signup-desktop.png",
      "/images/work/zedrift-login-mobile.png",
    ],
    imageCaptions: {
      "/images/work/zedrift-city-plan.png": "City map asset from the project repository; top-down layout.",
      "/images/work/zedrift-login-desktop.png": "Player sign-in in a local frontend session; server offline.",
      "/images/work/zedrift-signup-desktop.png": "Player registration interface in the local frontend; form not submitted.",
      "/images/work/zedrift-login-mobile.png": "Responsive player sign-in interface in the local frontend; server offline.",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
