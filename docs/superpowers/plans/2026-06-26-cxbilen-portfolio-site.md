# cxbilen.com Portfolio + CV Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portfolio-first personal site at cxbilen.com with a native themeable CV, downloadable PDFs, and placeholder case studies, on Next.js + Tailwind, deployable to Vercel.

**Architecture:** Next.js App Router (TypeScript) with a single CSS-custom-property theme system shared by the site and the CV. `next-themes` provides system-aware dark/light with manual toggle. Project data is centralized in `lib/projects.ts` and drives both the home grid and statically-generated `/work/[slug]` case studies. CV is rebuilt from the original DCLogic HTML into clean React components.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, next-themes, Vitest + @testing-library/react + jsdom.

## Global Constraints

- Accent color: `#6c5ce7` (CSS var `--accent`), used identically in dark and light.
- Typography: **Hanken Grotesk** (weights 400,500,600,700,800) + **Material Symbols Outlined** via Google Fonts.
- Default theme: `system` (auto), with manual toggle persisted to `localStorage` via next-themes.
- Content language: English (matches the CV). No i18n, no backend, no contact form.
- Dark palette: `bg #1c1c1c`, `card rgba(44,44,46,0.62)`, `cardborder rgba(255,255,255,0.10)`, `heading #f4f4f4`, `body #c6c6c6`, `muted #888888`, `line rgba(255,255,255,0.12)`, `social #7e7e7e`, `ring #3a3a3a`, bg image `bg-dark.png`, `cardshadow none`.
- Light palette: `bg #f4f4f5`, `card rgba(255,255,255,0.60)`, `cardborder rgba(0,0,0,0.06)`, `heading #1f1f1f`, `body #555555`, `muted #9a9a9a`, `line rgba(0,0,0,0.10)`, `social #a6a6a6`, `ring #ececec`, bg image `bg-light.png`, `cardshadow 0 14px 36px rgba(0,0,0,0.08)`.
- Three projects (slugs): `looplift`, `ux-sentinel`, `maestro`. Taglines from the CV Selected Work.
- PDFs: `Cem Bilen CV 2026 Dark.pdf`, `Cem Bilen CV 2026 Light.pdf` served from `public/cv/`.
- Commit after every task. Run `npm run build` before any deploy claim.

---

### Task 1: Scaffold Next.js project with TypeScript, Tailwind, and Vitest

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore` (update), `.eslintrc.json`
- Test: `lib/__tests__/smoke.test.ts`

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build`, plus `npm run test` (Vitest) wired to jsdom + testing-library.

- [ ] **Step 1: Initialize package.json**

Create `package.json`:

```json
{
  "name": "cxbilen-com",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "15.3.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next-themes": "0.4.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.4",
    "tailwindcss": "4.1.4",
    "typescript": "5.8.3",
    "@types/node": "22.14.0",
    "@types/react": "19.1.2",
    "@types/react-dom": "19.1.2",
    "vitest": "3.1.1",
    "jsdom": "26.0.0",
    "@testing-library/react": "16.3.0",
    "@testing-library/jest-dom": "6.6.3",
    "@vitejs/plugin-react": "4.3.4",
    "eslint": "9.24.0",
    "eslint-config-next": "15.3.0"
  }
}
```

- [ ] **Step 2: Add config files**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: { "@tailwindcss/postcss": {} },
};
export default config;
```

Create `.eslintrc.json`:

```json
{ "extends": "next/core-web-vitals" }
```

- [ ] **Step 3: Add Tailwind v4 globals**

Create `app/globals.css`:

```css
@import "tailwindcss";

html,
body {
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 4: Add minimal layout and home page**

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cem Bilen",
  description: "Product Designer & Senior UX Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
export default function Home() {
  return <main>cxbilen.com</main>;
}
```

- [ ] **Step 5: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Update .gitignore**

Ensure `.gitignore` contains (append any missing lines):

```
node_modules
.next
out
.env*.local
*.tsbuildinfo
next-env.d.ts
coverage
```

- [ ] **Step 7: Write the smoke test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("toolchain", () => {
  it("runs vitest", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 8: Install and verify**

Run: `npm install`
Run: `npm run test`
Expected: PASS (1 test).
Run: `npm run build`
Expected: build succeeds, generates `/` route.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind v4 + Vitest"
```

---

### Task 2: Theme tokens + ThemeProvider + ThemeToggle

**Files:**
- Create: `styles/tokens.css`, `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`
- Modify: `app/globals.css`, `app/layout.tsx`
- Test: `components/__tests__/ThemeToggle.test.tsx`

**Interfaces:**
- Produces:
  - `ThemeProvider` (default export) wrapping `next-themes` with `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`.
  - `ThemeToggle` (default export) — a button toggling between `light`/`dark`, `aria-label="Toggle theme"`.
  - CSS custom properties on `[data-theme="dark"]` and `[data-theme="light"]`: `--bg --card --cardborder --heading --body --muted --line --social --ring --cardshadow --bgimg --accent`.

- [ ] **Step 1: Write the failing test**

Create `components/__tests__/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  it("renders an accessible toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ThemeToggle`
Expected: FAIL — cannot find module `@/components/ThemeProvider`.

- [ ] **Step 3: Create the theme token stylesheet**

Create `styles/tokens.css`:

```css
:root {
  --accent: #6c5ce7;
}

[data-theme="dark"] {
  --bg: #1c1c1c;
  --card: rgba(44, 44, 46, 0.62);
  --cardborder: rgba(255, 255, 255, 0.1);
  --heading: #f4f4f4;
  --body: #c6c6c6;
  --muted: #888888;
  --line: rgba(255, 255, 255, 0.12);
  --social: #7e7e7e;
  --ring: #3a3a3a;
  --cardshadow: none;
  --bgimg: url("/images/bg-dark.png");
}

[data-theme="light"] {
  --bg: #f4f4f5;
  --card: rgba(255, 255, 255, 0.6);
  --cardborder: rgba(0, 0, 0, 0.06);
  --heading: #1f1f1f;
  --body: #555555;
  --muted: #9a9a9a;
  --line: rgba(0, 0, 0, 0.1);
  --social: #a6a6a6;
  --ring: #ececec;
  --cardshadow: 0 14px 36px rgba(0, 0, 0, 0.08);
  --bgimg: url("/images/bg-light.png");
}

body {
  background: var(--bg);
  color: var(--body);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Import tokens and set Tailwind theme inline**

Replace `app/globals.css` with:

```css
@import "tailwindcss";
@import "../styles/tokens.css";

@theme inline {
  --color-bg: var(--bg);
  --color-card: var(--card);
  --color-heading: var(--heading);
  --color-body: var(--body);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-line: var(--line);
  --color-social: var(--social);
  --font-sans: "Hanken Grotesk", system-ui, sans-serif;
}

html,
body {
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 5: Create ThemeProvider**

Create `components/ThemeProvider.tsx`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 6: Create ThemeToggle**

Create `components/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-social transition-colors hover:text-accent"
    >
      <span className="material-symbols-outlined text-[18px] leading-none">
        {mounted && isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
```

- [ ] **Step 7: Wrap layout with ThemeProvider**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Cem Bilen",
  description: "Product Designer & Senior UX Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test -- ThemeToggle`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: theme tokens, ThemeProvider, and ThemeToggle"
```

---

### Task 3: Fonts, Nav, and root layout chrome

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`
- Test: `components/__tests__/Nav.test.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` from Task 2.
- Produces: `Nav` (default export) — top navigation with links to `/` (logo), `/work`, `/cv`, plus `ThemeToggle`. Renders `<nav>` with `aria-label="Main"`.

- [ ] **Step 1: Write the failing test**

Create `components/__tests__/Nav.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThemeProvider from "@/components/ThemeProvider";
import Nav from "@/components/Nav";

describe("Nav", () => {
  it("links to home, work, and cv", () => {
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
    );
    expect(screen.getByRole("link", { name: /work/i })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getByRole("link", { name: /cv/i })).toHaveAttribute(
      "href",
      "/cv",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- Nav`
Expected: FAIL — cannot find module `@/components/Nav`.

- [ ] **Step 3: Create Nav**

Create `components/Nav.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--bg) 70%, transparent)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image
            src="/images/cx-logo.png"
            alt="Cem Bilen"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-bold text-heading">Cem Bilen</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-body">
          <Link href="/work" className="transition-colors hover:text-accent">
            Work
          </Link>
          <Link href="/cv" className="transition-colors hover:text-accent">
            CV
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Load fonts and render Nav in layout**

Replace the `<head>`/`<body>` region of `app/layout.tsx` so the file reads:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Cem Bilen — Product Designer & Senior UX Engineer",
  description: "Product Designer & Senior UX Engineer based in Izmir, Türkiye.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Add Material Symbols base class**

Append to `app/globals.css`:

```css
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- Nav`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: fonts and top navigation"
```

---

### Task 4: Migrate static assets (images + PDFs)

**Files:**
- Create: `public/images/photo.jpg`, `public/images/bg-dark.png`, `public/images/bg-light.png`, `public/images/cx-logo.png`, `public/cv/Cem Bilen CV 2026 Dark.pdf`, `public/cv/Cem Bilen CV 2026 Light.pdf`, `public/images/placeholder-cover.svg`
- Copy from: `Cem Bilen CV 2026 HTML/` and `Cem Bilen CV 2026 HTML/PDF/`

**Interfaces:**
- Produces: assets at the public paths referenced by tokens (`/images/bg-*.png`), Nav (`/images/cx-logo.png`), CV (`/images/photo.jpg`), and DownloadCV (`/cv/*.pdf`).

- [ ] **Step 1: Copy images and PDFs into public**

Run:

```bash
mkdir -p public/images public/cv
cp "Cem Bilen CV 2026 HTML/photo.jpg" public/images/photo.jpg
cp "Cem Bilen CV 2026 HTML/bg-dark.png" public/images/bg-dark.png
cp "Cem Bilen CV 2026 HTML/bg-light.png" public/images/bg-light.png
cp "Cem Bilen CV 2026 HTML/cx-logo.png" public/images/cx-logo.png
cp "Cem Bilen CV 2026 HTML/PDF/Cem Bilen CV 2026 Dark.pdf" "public/cv/Cem Bilen CV 2026 Dark.pdf"
cp "Cem Bilen CV 2026 HTML/PDF/Cem Bilen CV 2026 Light.pdf" "public/cv/Cem Bilen CV 2026 Light.pdf"
```

- [ ] **Step 2: Create a placeholder project cover**

Create `public/images/placeholder-cover.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6c5ce7"/>
      <stop offset="1" stop-color="#5849c2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#g)"/>
  <text x="600" y="390" font-family="Hanken Grotesk, sans-serif" font-size="64" font-weight="800" fill="#ffffff" text-anchor="middle">Case Study</text>
</svg>
```

- [ ] **Step 3: Copy favicon assets into public**

Run:

```bash
cp -R favicon public/favicon
cp favicon/favicon.ico public/favicon.ico
```

- [ ] **Step 4: Verify files exist**

Run: `ls public/images public/cv public/favicon`
Expected: all six images/PDFs present plus favicon assets.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: migrate CV images, PDFs, and favicons into public"
```

---

### Task 5: Project data model

**Files:**
- Create: `lib/projects.ts`
- Test: `lib/__tests__/projects.test.ts`

**Interfaces:**
- Produces:
  - `type CaseSection = { heading: string; body: string }`
  - `type Project = { slug: string; title: string; tagline: string; tags: string[]; cover: string; year: string; role: string; problem: string; sections: CaseSection[]; gallery: string[] }`
  - `const projects: Project[]`
  - `function getProject(slug: string): Project | undefined`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/projects.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { projects, getProject } from "@/lib/projects";

describe("projects data", () => {
  it("has the three seeded projects with unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toEqual(["looplift", "ux-sentinel", "maestro"]);
    expect(new Set(slugs).size).toBe(3);
  });

  it("every project has a tagline, cover, and at least one section", () => {
    for (const p of projects) {
      expect(p.tagline.length).toBeGreaterThan(0);
      expect(p.cover.length).toBeGreaterThan(0);
      expect(p.sections.length).toBeGreaterThan(0);
    }
  });

  it("getProject returns by slug and undefined for unknown", () => {
    expect(getProject("maestro")?.title).toBe("Maestro");
    expect(getProject("nope")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- projects`
Expected: FAIL — cannot find module `@/lib/projects`.

- [ ] **Step 3: Implement the data module**

Create `lib/projects.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- projects`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: project data model with three seeded case studies"
```

---

### Task 6: Reusable UI primitives — Card surface, SectionHeading, ProjectCard

**Files:**
- Create: `components/Card.tsx`, `components/SectionHeading.tsx`, `components/ProjectCard.tsx`
- Test: `components/__tests__/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: `Project` from Task 5.
- Produces:
  - `Card` (default export): `({ children, className?, style? }) => JSX` — glassmorphism surface using `--card`, `--cardborder`, `--cardshadow`.
  - `SectionHeading` (default export): `({ icon, children }) => JSX` — Material Symbol + heading text.
  - `ProjectCard` (default export): `({ project }: { project: Project }) => JSX` — links to `/work/${slug}`, shows cover, title, tagline, tags.

- [ ] **Step 1: Write the failing test**

Create `components/__tests__/ProjectCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "@/components/ProjectCard";
import { getProject } from "@/lib/projects";

describe("ProjectCard", () => {
  it("renders title and links to the case study", () => {
    const project = getProject("looplift")!;
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Looplift")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/work/looplift");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ProjectCard`
Expected: FAIL — cannot find module `@/components/ProjectCard`.

- [ ] **Step 3: Create Card**

Create `components/Card.tsx`:

```tsx
export default function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[22px] border backdrop-blur-md ${className}`}
      style={{
        background: "var(--card)",
        borderColor: "var(--cardborder)",
        boxShadow: "var(--cardshadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create SectionHeading**

Create `components/SectionHeading.tsx`:

```tsx
export default function SectionHeading({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="material-symbols-outlined text-[22px] text-accent">
        {icon}
      </span>
      <h2 className="text-xl font-bold text-heading">{children}</h2>
    </div>
  );
}
```

- [ ] **Step 5: Create ProjectCard**

Create `components/ProjectCard.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import Card from "@/components/Card";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <Card className="overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-heading">{project.title}</h3>
          <p className="mt-1 text-sm text-body">{project.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted"
                style={{ borderColor: "var(--line)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- ProjectCard`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Card, SectionHeading, and ProjectCard primitives"
```

---

### Task 7: Home page — Hero, Work grid, About, Footer

**Files:**
- Create: `components/Hero.tsx`, `components/Footer.tsx`, `components/Background.tsx`
- Modify: `app/page.tsx`
- Test: `app/__tests__/home.test.tsx`

**Interfaces:**
- Consumes: `projects` (Task 5), `ProjectCard`, `SectionHeading`, `Card` (Task 6).
- Produces:
  - `Background` (default export): fixed full-bleed div using `var(--bgimg)`.
  - `Hero` (default export): name, role, pitch, CTA buttons (View work → `/work`, Download CV → `/cv`).
  - `Footer` (default export): contact links (email, LinkedIn, GitHub, location).
  - `Home` page composing Hero + work grid + about + Footer.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/home.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("shows the name and all three projects", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /cem bilen/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Looplift")).toBeInTheDocument();
    expect(screen.getByText("UX Sentinel")).toBeInTheDocument();
    expect(screen.getByText("Maestro")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- home`
Expected: FAIL — `app/page.tsx` has no `<h1>` / projects yet.

- [ ] **Step 3: Create Background**

Create `components/Background.tsx`:

```tsx
export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top"
      style={{ backgroundImage: "var(--bgimg)" }}
    />
  );
}
```

- [ ] **Step 4: Create Hero**

Create `components/Hero.tsx`:

```tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        Product Designer · Senior UX Engineer
      </p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight text-heading sm:text-6xl">
        Cem Bilen
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
        I own product surfaces end-to-end — from ambiguous requirements to
        polished, shipped UI — pairing design systems and experimentation-driven
        CRO with hands-on front-end execution.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/work"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          View work
        </Link>
        <Link
          href="/cv"
          className="rounded-full border px-6 py-3 text-sm font-semibold text-heading transition-colors hover:text-accent"
          style={{ borderColor: "var(--line)" }}
        >
          View CV
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create Footer**

Create `components/Footer.tsx`:

```tsx
import Link from "next/link";

const links = [
  { label: "Email", href: "mailto:cem@cxbilen.com", icon: "mail" },
  { label: "LinkedIn", href: "https://linkedin.com/in/cxbilen", icon: "link" },
  { label: "GitHub", href: "https://github.com/CXBilen", icon: "code" },
];

export default function Footer() {
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Izmir, Türkiye · © {2026} Cem Bilen
        </p>
        <div className="flex gap-5 text-sm font-medium text-social">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="flex items-center gap-2 transition-colors hover:text-accent"
            >
              <span className="material-symbols-outlined text-[18px]">
                {l.icon}
              </span>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Compose the home page**

Replace `app/page.tsx` with:

```tsx
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
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm run test -- home`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: home page with hero, work grid, about, and footer"
```

---

### Task 8: Work index and case study pages

**Files:**
- Create: `app/work/page.tsx`, `app/work/[slug]/page.tsx`, `components/work/CaseStudy.tsx`
- Test: `app/__tests__/casestudy.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProject` (Task 5), `ProjectCard`, `SectionHeading`, `Card`, `Background`.
- Produces:
  - `/work` page listing all projects.
  - `/work/[slug]` page calling `generateStaticParams` from `projects` and `generateMetadata` per project; renders `CaseStudy`.
  - `CaseStudy` (default export): `({ project }: { project: Project }) => JSX`.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/casestudy.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CaseStudy from "@/components/work/CaseStudy";
import { getProject } from "@/lib/projects";

describe("CaseStudy", () => {
  it("renders the project title, tagline, and section headings", () => {
    const project = getProject("ux-sentinel")!;
    render(<CaseStudy project={project} />);
    expect(
      screen.getByRole("heading", { name: "UX Sentinel", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(project.tagline)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Process" }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- casestudy`
Expected: FAIL — cannot find module `@/components/work/CaseStudy`.

- [ ] **Step 3: Create CaseStudy**

Create `components/work/CaseStudy.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function CaseStudy({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-16">
      <Link
        href="/work"
        className="text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← All work
      </Link>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        {project.role} · {project.year}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-heading sm:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-body">{project.tagline}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted"
            style={{ borderColor: "var(--line)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-[22px]">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-bold text-accent">The problem</h2>
        <p className="mt-2 leading-relaxed text-body">{project.problem}</p>
      </section>

      {project.sections.map((s) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-2xl font-bold text-heading">{s.heading}</h2>
          <p className="mt-2 leading-relaxed text-body">{s.body}</p>
        </section>
      ))}

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {project.gallery.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src={src}
              alt={`${project.title} visual ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Create the work index page**

Create `app/work/page.tsx`:

```tsx
import type { Metadata } from "next";
import Background from "@/components/Background";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Cem Bilen",
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
```

- [ ] **Step 5: Create the dynamic case study route**

Create `app/work/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Background from "@/components/Background";
import CaseStudy from "@/components/work/CaseStudy";
import { projects, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: `${project.title} — Cem Bilen`, description: project.tagline };
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <>
      <Background />
      <CaseStudy project={project} />
    </>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- casestudy`
Expected: PASS.

- [ ] **Step 7: Verify build generates all routes**

Run: `npm run build`
Expected: build succeeds; output lists `/work` and three `/work/[slug]` static pages.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: work index and static case study pages"
```

---

### Task 9: CV components and page

**Files:**
- Create: `lib/cv.ts`, `components/cv/Sidebar.tsx`, `components/cv/CVMain.tsx`, `components/cv/DownloadCV.tsx`, `app/cv/page.tsx`
- Test: `components/cv/__tests__/DownloadCV.test.tsx`, `components/cv/__tests__/CVMain.test.tsx`

**Interfaces:**
- Consumes: `Card`, `Background`, `useTheme` (next-themes).
- Produces:
  - `lib/cv.ts` exporting `cvData` with `contact`, `skills`, `tools`, `experience`, `education`, `selectedWork`, `socials`.
  - `Sidebar`, `CVMain` (default exports) rendering CV data.
  - `DownloadCV` (default export): client component; picks `/cv/Cem Bilen CV 2026 Dark.pdf` when `resolvedTheme === "dark"`, otherwise the Light PDF; renders an `<a download>` labeled "Download PDF".

- [ ] **Step 1: Write the failing tests**

Create `components/cv/__tests__/DownloadCV.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DownloadCV from "@/components/cv/DownloadCV";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}));

describe("DownloadCV", () => {
  it("links to the dark PDF in dark theme", () => {
    render(<DownloadCV />);
    const link = screen.getByRole("link", { name: /download pdf/i });
    expect(link.getAttribute("href")).toContain("Dark.pdf");
    expect(link).toHaveAttribute("download");
  });
});
```

Create `components/cv/__tests__/CVMain.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CVMain from "@/components/cv/CVMain";

describe("CVMain", () => {
  it("renders experience entries", () => {
    render(<CVMain />);
    expect(screen.getByText(/Senior UX Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Efsora Labs/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- cv`
Expected: FAIL — cannot find CV modules.

- [ ] **Step 3: Create the CV data module**

Create `lib/cv.ts`:

```ts
export const cvData = {
  name: "Cem Bilen",
  title: "Product Designer",
  subtitle: "Senior UX Engineer",
  contact: {
    email: "cem@cxbilen.com",
    phone: "+90 530 040 23 92",
    location: "Izmir, Türkiye",
  },
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/cxbilen" },
    { label: "Portfolio", href: "https://cxbilen.com" },
    { label: "GitHub", href: "https://github.com/CXBilen" },
  ],
  skills: [
    "Product Design",
    "Figma",
    "UX / UI Design",
    "Design Systems",
    "UX Engineering",
    "Prototyping",
    "CRO",
    "A/B Testing",
    "Journey Mapping",
    "Heuristic Audits",
  ],
  tools: [
    "HTML / CSS",
    "React",
    "JavaScript",
    "Next.js",
    "SASS",
    "Tailwind CSS",
    "Design Tokens",
    "GA4 / Funnels",
    "Looker Studio",
    "AI Prototyping",
  ],
  about:
    "Product Designer and Senior UX Engineer with 5+ years across consumer and SaaS products — owning surfaces end-to-end from ambiguous requirements to polished, shipped UI. I pair design systems and experimentation-driven CRO with hands-on front-end execution, so product decisions are fast to test, build, and improve.",
  experience: [
    {
      role: "Senior UX Engineer",
      company: "Efsora Labs",
      period: "Feb 2026 – Present · Türkiye",
      body: "Lead UX design, design systems, and frontend-ready implementation across SaaS and web flows — turning PRDs into journeys, Figma, prototypes, and dev-ready specs, and standardising a design system of 40+ components.",
    },
    {
      role: "Senior CRO Executive",
      company: "Digital House",
      period: "Mar 2025 – Jan 2026 · Istanbul",
      body: "Owned CRO and UX for web and e-commerce, turning funnel analysis into prioritized A/B tests that lifted conversion +12% and reduced checkout drop-off −16%.",
    },
    {
      role: "UX/UI Designer",
      company: "Eva",
      period: "Sep 2023 – Aug 2024 · Izmir",
      body: "Designed end-to-end SaaS interfaces and Figma prototypes, simplifying complex flows into clear workflows and improving task-success in usability tests by +20%.",
    },
    {
      role: "Designer Project Manager",
      company: "innoscripta AG",
      period: "May 2023 – Jul 2023 · Berlin",
      body: "",
    },
    {
      role: "UX/UI Designer",
      company: "StudioMoco",
      period: "Dec 2022 – May 2023 · Nuremberg",
      body: "",
    },
    {
      role: "CRO Executive",
      company: "Hype",
      period: "Apr 2022 – Sep 2022 · Istanbul",
      body: "",
    },
    {
      role: "Web Developer",
      company: "İnce Fikirler",
      period: "Mar 2019 – Feb 2020 · Izmir",
      body: "",
    },
  ],
  education: [
    {
      title: "Associate's, Computer Programming",
      org: "Izmir University of Economics",
      period: "2014 – 2016",
      body: "Software, web, and database fundamentals — the technical base behind a design practice that ships.",
    },
    {
      title: "Database Interactive Programming",
      org: "Ç. Altan Anatolian Technical HS",
      period: "2010 – 2014",
      body: "",
    },
  ],
  selectedWork: [
    {
      name: "Looplift",
      desc: "AI-assisted UX experimentation & product-growth concept.",
    },
    {
      name: "UX Sentinel",
      desc: "UX-to-code, design-system & AI-agent exploration.",
    },
    {
      name: "Maestro",
      desc: "Web-app architecture, AI workflows & user-facing product.",
    },
  ],
};
```

- [ ] **Step 4: Create DownloadCV**

Create `components/cv/DownloadCV.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";

const DARK = "/cv/Cem Bilen CV 2026 Dark.pdf";
const LIGHT = "/cv/Cem Bilen CV 2026 Light.pdf";

export default function DownloadCV() {
  const { resolvedTheme } = useTheme();
  const href = resolvedTheme === "dark" ? DARK : LIGHT;
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      Download PDF
    </a>
  );
}
```

- [ ] **Step 5: Create Sidebar**

Create `components/cv/Sidebar.tsx`:

```tsx
import Image from "next/image";
import Card from "@/components/Card";
import { cvData } from "@/lib/cv";

function IconRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-body">
      <span className="material-symbols-outlined text-[17px] text-accent">
        {icon}
      </span>
      {children}
    </div>
  );
}

function Grid({ title, icon, items }: { title: string; icon: string; items: string[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-accent">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-heading">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {items.map((i) => (
          <span key={i} className="text-xs font-medium text-body">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-7 sm:w-[260px] sm:flex-none">
      <Card className="p-7">
        <div className="mb-5 flex justify-center">
          <div
            className="h-[90px] w-[90px] rounded-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/photo.jpg')",
              border: "3px solid var(--ring)",
            }}
          />
        </div>
        <div className="text-xl font-bold text-heading">{cvData.name}</div>
        <div className="mt-1 text-sm font-bold text-accent">{cvData.title}</div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {cvData.subtitle}
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <IconRow icon="mail">{cvData.contact.email}</IconRow>
          <IconRow icon="call">{cvData.contact.phone}</IconRow>
          <IconRow icon="location_on">{cvData.contact.location}</IconRow>
        </div>
      </Card>

      <Grid title="Skills" icon="psychology" items={cvData.skills} />
      <Grid title="Tools" icon="build" items={cvData.tools} />

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        {cvData.socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between border-b py-3 text-sm font-medium text-social transition-colors hover:text-accent"
            style={{ borderColor: "var(--line)" }}
          >
            {s.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Create CVMain**

Create `components/cv/CVMain.tsx`:

```tsx
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
```

- [ ] **Step 7: Create the CV page**

Create `app/cv/page.tsx`:

```tsx
import type { Metadata } from "next";
import Background from "@/components/Background";
import Card from "@/components/Card";
import Sidebar from "@/components/cv/Sidebar";
import CVMain from "@/components/cv/CVMain";
import DownloadCV from "@/components/cv/DownloadCV";

export const metadata: Metadata = {
  title: "CV — Cem Bilen",
  description: "Curriculum vitae of Cem Bilen, Product Designer & Senior UX Engineer.",
};

export default function CVPage() {
  return (
    <>
      <Background />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-heading">CV</h1>
          <DownloadCV />
        </div>
        <Card className="p-8">
          <div className="flex flex-col gap-10 sm:flex-row">
            <Sidebar />
            <CVMain />
          </div>
        </Card>
      </main>
    </>
  );
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm run test -- cv`
Expected: PASS (DownloadCV + CVMain).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: native CV page with sidebar, main, and theme-aware PDF download"
```

---

### Task 10: SEO — metadata, favicon, sitemap, robots, OG image

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/icon.png` (copy), `app/apple-icon.png` (copy)
- Modify: `app/layout.tsx`
- Test: `app/__tests__/sitemap.test.ts`

**Interfaces:**
- Consumes: `projects` (Task 5).
- Produces: `sitemap()` returning entries for `/`, `/work`, `/cv`, and each `/work/[slug]`; `robots()` allowing all and pointing to the sitemap.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes home, work, cv, and every project", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://cxbilen.com");
    expect(urls).toContain("https://cxbilen.com/work");
    expect(urls).toContain("https://cxbilen.com/cv");
    expect(urls).toContain("https://cxbilen.com/work/looplift");
    expect(urls).toContain("https://cxbilen.com/work/ux-sentinel");
    expect(urls).toContain("https://cxbilen.com/work/maestro");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- sitemap`
Expected: FAIL — cannot find module `@/app/sitemap`.

- [ ] **Step 3: Create sitemap**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE = "https://cxbilen.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/cv"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-06-26"),
  }));
  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: new Date("2026-06-26"),
  }));
  return [...staticRoutes, ...projectRoutes];
}
```

- [ ] **Step 4: Create robots**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://cxbilen.com/sitemap.xml",
  };
}
```

- [ ] **Step 5: Add app icons**

Run:

```bash
cp favicon/favicon-32x32.png app/icon.png
cp favicon/apple-touch-icon.png app/apple-icon.png
```

- [ ] **Step 6: Add metadataBase and OpenGraph to layout**

In `app/layout.tsx`, replace the `metadata` export with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://cxbilen.com"),
  title: {
    default: "Cem Bilen — Product Designer & Senior UX Engineer",
    template: "%s — Cem Bilen",
  },
  description: "Product Designer & Senior UX Engineer based in Izmir, Türkiye.",
  openGraph: {
    title: "Cem Bilen — Product Designer & Senior UX Engineer",
    description:
      "Product Designer & Senior UX Engineer based in Izmir, Türkiye.",
    url: "https://cxbilen.com",
    siteName: "cxbilen.com",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm run test -- sitemap`
Expected: PASS.

- [ ] **Step 8: Full build check**

Run: `npm run build`
Expected: succeeds, lists `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: SEO metadata, icons, sitemap, and robots"
```

---

### Task 11: Public README

**Files:**
- Create/Modify: `README.md`, `docs/screenshots/.gitkeep`
- Modify: `LICENSE` reference (verify MIT)

**Interfaces:**
- Produces: a GitHub-facing README with badges, icons, feature list, screenshot placeholders, run/deploy instructions.

- [ ] **Step 1: Confirm license**

Run: `head -1 LICENSE`
Expected: contains "MIT License". If not, note actual license and adjust the README badge.

- [ ] **Step 2: Create screenshots placeholder dir**

Run: `mkdir -p docs/screenshots && touch docs/screenshots/.gitkeep`

- [ ] **Step 3: Write README**

Replace `README.md` with:

```markdown
<div align="center">

# cxbilen.com

**Portfolio & CV of Cem Bilen — Product Designer & Senior UX Engineer**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://cxbilen.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-7c5ce7.svg)](LICENSE)

[**Live site → cxbilen.com**](https://cxbilen.com)

</div>

---

## ✨ Features

- ⚡ **Portfolio-first** — hero, selected work grid, and per-project case studies
- 🌓 **Auto dark / light** — follows system preference with a manual toggle
- 📄 **Native CV** — themeable CV page with theme-matched PDF download
- 🎨 **One design system** — shared CSS-variable tokens across site and CV
- 📱 **Responsive** — A4-inspired CV that gracefully reflows on mobile
- 🔎 **SEO-ready** — metadata, Open Graph, sitemap, and robots out of the box

## 🖼️ Screenshots

| Dark | Light |
| --- | --- |
| ![Dark mode](docs/screenshots/home-dark.png) | ![Light mode](docs/screenshots/home-light.png) |

## 🚀 Getting started

```bash
git clone https://github.com/CXBilen/cxbilen.com.git
cd cxbilen.com
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🧰 Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

## 🗂️ Project structure

```
app/            # routes: home, /work, /work/[slug], /cv
components/     # Nav, Hero, ProjectCard, ThemeToggle, cv/*, work/*
lib/            # projects + cv data
styles/         # theme tokens
public/         # images, PDFs, favicons
```

## 🧪 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run test` | Run the test suite |

## ▲ Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CXBilen/cxbilen.com)

## 📄 License

[MIT](LICENSE) © Cem Bilen
```

- [ ] **Step 4: Verify README renders locally**

Run: `head -20 README.md`
Expected: shows the centered title block and badges.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: public README with badges, features, and setup"
```

---

### Task 12: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds; route list includes `/`, `/work`, `/work/[slug]` (3 static), `/cv`, `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual smoke (optional, local)**

Run: `npm run dev`, then visit `/`, `/work`, `/work/looplift`, `/cv`. Toggle theme and confirm the CV download link switches between Dark/Light PDFs.

- [ ] **Step 5: Final commit (if any fixes)**

```bash
git add -A
git commit -m "chore: final verification fixes"
```

---

## Self-Review Notes

- **Spec coverage:** site structure (Tasks 3,7,8,9) ✓; theme system (Task 2) ✓; CV rebuild + theme-aware PDF (Tasks 4,9) ✓; placeholder case studies (Tasks 5,6,8) ✓; README (Task 11) ✓; SEO/deploy (Task 10, Task 12) ✓; asset migration (Task 4) ✓.
- **Email:** rendered plainly (`cem@cxbilen.com`) per spec's resolved default — Cloudflare obfuscation dropped. Update `lib/cv.ts` and `Footer.tsx` if the real address differs.
- **Type consistency:** `Project`/`CaseSection` defined in Task 5 and consumed unchanged in Tasks 6 & 8; `cvData` shape defined in Task 9 Step 3 and consumed in the same task's Sidebar/CVMain.
- **Known follow-ups (not blockers):** real case study copy/images; OG image art (`summary_large_image` works once an OG image is added); home-dark/home-light screenshots for the README.
