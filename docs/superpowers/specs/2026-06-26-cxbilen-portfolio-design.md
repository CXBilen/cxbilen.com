# cxbilen.com — Portfolio + CV Site Design

**Date:** 2026-06-26
**Status:** Approved
**Owner:** Cem Bilen

## Purpose

A personal site at **cxbilen.com** that is portfolio-first, with the CV available as a
dedicated section. Public GitHub repository, deployed on Vercel. The visual language is
inherited from the existing 2026 CV (`Cem Bilen CV 2026 HTML/`): Hanken Grotesk type,
purple accent `#6c5ce7`, and a dark/light glassmorphism card style.

## Goals

- Showcase Cem as a Product Designer / Senior UX Engineer.
- Present selected work (Looplift, UX Sentinel, Maestro) as case studies.
- Provide the CV as a native, themeable page plus downloadable PDF.
- Auto dark/light theming with manual toggle, matching the CV palettes exactly.
- Ship a polished public README for the GitHub repo.

## Non-Goals (YAGNI)

- No blog, CMS, or backend.
- No contact form / server — contact is direct links (email, phone, social).
- No i18n framework — single language (English content, as in the CV).
- No print-to-PDF; static PDFs are the download source of truth.

## Tech Stack

- **Next.js (App Router)** + **React** + **TypeScript**.
- **Tailwind CSS** for styling, driven by CSS custom properties for theme tokens.
- **next-themes** for system-preference-aware dark/light with manual toggle and
  `localStorage` persistence.
- **Hanken Grotesk** + **Material Symbols Outlined** via Google Fonts (as in the CV).
- Deployed on **Vercel**, custom domain `cxbilen.com`.

## Site Structure

| Route             | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `/`               | Portfolio home: Hero → Selected Work grid → About summary → Contact/footer |
| `/work/[slug]`    | Case study per project (placeholder template, filled later)             |
| `/cv`             | Native React CV + "Download PDF" button                                 |

**Navigation:** minimal top nav present on all pages — Logo (`cx-logo.png`) · Work · CV ·
ThemeToggle.

## Theme System

- Two palettes ported verbatim from the CV's `palettes()` (dark + light), exposed as CSS
  custom properties on a root wrapper:
  - Dark: `bg #1c1c1c`, `card rgba(44,44,46,0.62)`, `heading #f4f4f4`, `body #c6c6c6`,
    `muted #888888`, `line rgba(255,255,255,0.12)`, accent `#6c5ce7`, bg image `bg-dark.png`.
  - Light: `bg #f4f4f5`, `card rgba(255,255,255,0.60)`, `heading #1f1f1f`, `body #555555`,
    `muted #9a9a9a`, `line rgba(0,0,0,0.10)`, accent `#6c5ce7`, bg image `bg-light.png`,
    card shadow `0 14px 36px rgba(0,0,0,0.08)`.
- Default theme follows the system via `next-themes` (`defaultTheme="system"`); the toggle
  overrides and persists.
- Theme tokens defined once in `styles/tokens.css`; Tailwind reads them via
  `var(--token)` utilities / theme extension so both the site and CV share one source.

## CV Section (`/cv`)

- The CV markup in `Cem Bilen CV.dc.html` is rebuilt as clean React components, dropping
  the DCLogic runtime. Structure preserved 1:1:
  - **Sidebar:** photo (or "CB" monogram fallback), contact (email/phone/location),
    Skills grid, Tools grid, social links (LinkedIn, Portfolio, GitHub).
  - **Main:** About me, Experience (7 roles), Education (2), Selected Work (3).
- Same A4-proportioned card aesthetic, but responsive (collapses gracefully on mobile).
- **Download PDF button:** serves the PDF matching the active theme —
  `Cem Bilen CV 2026 Dark.pdf` in dark, `Cem Bilen CV 2026 Light.pdf` in light. Both live
  in `public/cv/`. (Source files currently in `Cem Bilen CV 2026 HTML/PDF/`.)

## Portfolio / Case Studies

- Project data centralized in `lib/projects.ts`:
  ```ts
  type Project = {
    slug: string;          // "looplift"
    title: string;         // "Looplift"
    tagline: string;       // short one-liner (from CV Selected Work)
    tags: string[];        // ["AI", "UX", "Product Growth"]
    cover: string;         // /public image path (placeholder for now)
    sections: CaseSection[]; // problem / process / outcome / gallery
  };
  ```
- Three projects seeded from the CV: **Looplift**, **UX Sentinel**, **Maestro** — with
  placeholder copy and placeholder images. Cem fills real content later.
- Home shows a responsive card grid; each card links to `/work/[slug]`.
- Case study template sections: Hero (title, tagline, tags, cover), Problem/Context,
  Process, Outcome/Impact, Image gallery, Next/Prev project nav.

## File Structure

```
app/
  layout.tsx              # ThemeProvider, fonts, nav, metadata
  page.tsx                # home (hero, work grid, about, footer)
  cv/page.tsx             # CV + download
  work/[slug]/page.tsx    # case study (generateStaticParams from projects)
components/
  Nav.tsx
  ThemeToggle.tsx
  Hero.tsx
  ProjectCard.tsx
  Footer.tsx
  cv/Sidebar.tsx
  cv/CVMain.tsx
  cv/DownloadCV.tsx
  work/CaseStudy.tsx
lib/
  projects.ts             # project data + types
styles/
  tokens.css              # dark/light CSS custom properties
  globals.css             # Tailwind layers + base
public/
  cv/                     # Dark + Light PDFs
  images/                 # placeholders, photo.jpg, bg-dark/light, cx-logo
  favicon/                # existing favicon assets
  og-image.png
README.md
```

## README.md (public repo)

- Banner/hero image (the site's OG image or a screenshot).
- One-line description + what the project is.
- **Shields.io badges:** Next.js, React, TypeScript, Tailwind CSS, Vercel, License (MIT).
- Feature list with emoji icons (⚡ portfolio, 🌓 auto dark/light, 📄 CV + PDF, 📱 responsive).
- Screenshots: dark + light side by side.
- Getting started: clone, `npm install`, `npm run dev`.
- Deploy section with "Deploy with Vercel" button.
- Tech stack list, project structure, license.

## Deployment & SEO

- Vercel project, `cxbilen.com` custom domain.
- Per-page metadata (title, description), Open Graph + Twitter card via `og-image.png`.
- `sitemap.ts` + `robots.ts`.
- Favicon wired from the existing `favicon/` assets and `site.webmanifest`.

## Asset Migration

- Move/copy from `Cem Bilen CV 2026 HTML/`: `photo.jpg`, `bg-dark.png`, `bg-light.png`,
  `cx-logo.png` → `public/images/`.
- Move PDFs from `Cem Bilen CV 2026 HTML/PDF/` → `public/cv/`.
- Keep the original `Cem Bilen CV 2026 HTML/` folder as reference (not served).

## Success Criteria

- Home, `/cv`, and `/work/[slug]` render with correct dark/light theming following system
  preference, toggle works and persists.
- CV visually matches the original and downloads the theme-correct PDF.
- All three case study pages render from `lib/projects.ts` with placeholder content.
- `npm run build` succeeds; deploys cleanly on Vercel.
- README renders with badges, icons, and screenshots on GitHub.

## Open Items (resolved defaults)

- Contact: direct links only (email/phone/social from CV) — no form.
- Email obfuscation: render plainly or with a lightweight obfuscation; the Cloudflare
  email-protection from the source HTML is dropped.
