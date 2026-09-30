# Design system

## Project decision

COSS defaults are the visual source of truth for cxbilen.com and its CV. This is the owner's explicit decision of 26 September 2026. Use the official components, semantic colors, typography, spacing and interaction patterns when implementing or maintaining the site.

The source is the distributed **COSS style preset and component registry**, pinned to commit [`59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e`](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e). Preserve this revision until an intentional upstream update is made and verified.

## Authoritative sources

- [Get Started](https://coss.com/ui/docs/get-started) and [Styling](https://coss.com/ui/docs/styling).
- [Pinned style preset](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/public/r/style.json) and [preset definitions](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/registry-styles.ts).
- [Pinned font definitions](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/registry-fonts.ts).
- [Pinned component registry](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/ui).
- [COSS skill](/Users/cxbilen/.codex/skills/coss/SKILL.md), installed from the same revision. Its component and styling references guide implementation.
- [Third-party notices](../THIRD_PARTY_NOTICES.md) record the component license and attribution.

The COSS documentation website has its own font and small theme adjustments. The distributed preset determines this project's defaults: Inter and Geist Mono, and the color values below.

## Typography

| Role | Font | Variable |
| --- | --- | --- |
| Body, labels, buttons | Inter | `--font-sans` |
| Headings | Inter | `--font-heading`, aliased to `--font-sans` |
| Code and monospace text | Geist Mono | `--font-mono` |

Keep these names aligned with the COSS components. Load the font files locally through the app's font setup so rendering and PDF export use the same families. Preserve the regular, medium, semibold and bold distinctions supplied by components.

## Theme tokens

The following values come directly from the pinned `@coss/style` registry. Tailwind v4 resolves `--alpha()` and palette variables during the build. Keep these values and their light/dark relationships intact.

| Token | Light | Dark |
| --- | --- | --- |
| `--accent` | `--alpha(var(--color-black) / 4%)` | `--alpha(var(--color-white) / 4%)` |
| `--accent-foreground` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--background` | `var(--color-white)` | `color-mix(in srgb, var(--color-neutral-950) 95%, var(--color-white))` |
| `--border` | `--alpha(var(--color-black) / 8%)` | `--alpha(var(--color-white) / 6%)` |
| `--card` | `var(--color-white)` | `color-mix(in srgb, var(--background) 98%, var(--color-white))` |
| `--card-foreground` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--destructive` | `var(--color-red-500)` | `color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))` |
| `--destructive-foreground` | `var(--color-red-700)` | `var(--color-red-400)` |
| `--foreground` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--info` | `var(--color-blue-500)` | `var(--color-blue-500)` |
| `--info-foreground` | `var(--color-blue-700)` | `var(--color-blue-400)` |
| `--input` | `--alpha(var(--color-black) / 10%)` | `--alpha(var(--color-white) / 8%)` |
| `--muted` | `--alpha(var(--color-black) / 4%)` | `--alpha(var(--color-white) / 4%)` |
| `--muted-foreground` | `color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-black))` | `color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-white))` |
| `--popover` | `var(--color-white)` | `color-mix(in srgb, var(--background) 98%, var(--color-white))` |
| `--popover-foreground` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--primary` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--primary-foreground` | `var(--color-neutral-50)` | `var(--color-neutral-800)` |
| `--ring` | `var(--color-neutral-400)` | `var(--color-neutral-500)` |
| `--secondary` | `--alpha(var(--color-black) / 4%)` | `--alpha(var(--color-white) / 4%)` |
| `--secondary-foreground` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--success` | `var(--color-emerald-500)` | `var(--color-emerald-500)` |
| `--success-foreground` | `var(--color-emerald-700)` | `var(--color-emerald-400)` |
| `--warning` | `var(--color-amber-500)` | `var(--color-amber-500)` |
| `--warning-foreground` | `var(--color-amber-700)` | `var(--color-amber-400)` |
| `--chart-1` | `var(--color-orange-600)` | `var(--color-blue-700)` |
| `--chart-2` | `var(--color-teal-600)` | `var(--color-emerald-500)` |
| `--chart-3` | `var(--color-cyan-900)` | `var(--color-amber-500)` |
| `--chart-4` | `var(--color-amber-400)` | `var(--color-purple-500)` |
| `--chart-5` | `var(--color-amber-500)` | `var(--color-rose-500)` |
| `--code` | `var(--color-white)` | `color-mix(in srgb, var(--background) 98%, var(--color-white))` |
| `--code-foreground` | `var(--foreground)` | `var(--foreground)` |
| `--code-highlight` | `--alpha(var(--color-black) / 4%)` | `--alpha(var(--color-white) / 4%)` |
| `--sidebar` | `var(--color-neutral-50)` | `color-mix(in srgb, var(--color-neutral-950) 97%, var(--color-white))` |
| `--sidebar-accent` | `--alpha(var(--color-black) / 4%)` | `--alpha(var(--color-white) / 4%)` |
| `--sidebar-accent-foreground` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--sidebar-border` | `--alpha(var(--color-black) / 6%)` | `--alpha(var(--color-white) / 5%)` |
| `--sidebar-foreground` | `color-mix(in srgb, var(--color-neutral-800) 64%, var(--sidebar))` | `color-mix(in srgb, var(--color-neutral-100) 64%, var(--sidebar))` |
| `--sidebar-primary` | `var(--color-neutral-800)` | `var(--color-neutral-100)` |
| `--sidebar-primary-foreground` | `var(--color-neutral-50)` | `var(--color-neutral-800)` |
| `--sidebar-ring` | `var(--color-neutral-400)` | `var(--color-neutral-400)` |

The shared radius token is `--radius: 0.625rem`. Keep component shape utilities and their theme mapping consistent: Button uses `rounded-lg`, Card `rounded-2xl`, and Badge `rounded-sm`. Preserve the primitive's classes and size variants when adapting layouts.

Use semantic utility names such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground` and `border-border`. Component color variants express intent, including status and destructive actions.

## Components and composition

The local component copies come from the pinned MIT-licensed `apps/ui` registry. Keep their `data-slot` attributes, keyboard/focus behavior, Base UI composition and built-in responsive sizes.

| Primitive | Official defaults and usage |
| --- | --- |
| Button | Medium weight; `text-base sm:text-sm`; default `h-9 sm:h-8`; primary fill and foreground; 1px border; subtle inset highlight and small bottom shadow. Use the documented `variant` and `size` props. |
| Card | Semantic card surface; 1px border; `shadow-xs/5`; subtle light/dark edge shadows. Header, panel and footer provide their own padding. Title uses heading font, semibold, `text-lg` and `leading-none`; description uses muted `text-sm`. |
| Badge | Medium weight, compact responsive height, semantic variants and `rounded-sm`. Use the component's size options so labels and icons retain the intended proportions. |

Project technology tags use the official default Badge size with `gap-2` between items. The owner's clarification on 30 September 2026 preserves the original height and text size: 22px/14px on mobile and 18px/12px on desktop. Apply `className="px-2"` at the two project-tag usages to give the text 8px horizontal padding. This spacing adjustment replaces the earlier `lg` implementation, which increased the height and text size beyond the requested change. The registry primitive stays pinned and unchanged.

The official [card particle](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/particles/p-card-1.tsx) composes `CardHeader`, `CardTitle`, `CardDescription`, `CardPanel` and `CardFooter` inside `Card`. Add layout classes around this structure as needed. The [button particle](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/apps/ui/registry/default/particles/p-button-1.tsx) uses the default primitive directly. A navigation link can use `Button` with `render={<Link href="…" />}` as documented by COSS.

The selected primitives use `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge` and `lucide-react` through the loading spinner. Follow the lockfile for installed versions. Adapt local import paths while retaining upstream behavior and styling.

Keep the body positioned relatively and the application root isolated for Base UI layering. Use ordinary responsive layout utilities for page composition; let COSS primitives own component geometry and visual states. Honor reduced motion and visible keyboard focus.

### Header theme control

The header uses Hugeicons, the icon family used by the pinned [COSS ModeSwitcher](https://github.com/cosscom/coss/blob/59e8c88c4be28cbfdd9eb3cd7274c60ffa91413e/packages/ui/src/shared/mode-switcher.tsx). The selected preference determines the icon: Lucide `ContrastIcon` (`lucide-contrast`) for System, Hugeicons `Moon02Icon` for Dark and `Sun03Icon` for Light. The System icon is the owner's explicit selection of 30 September 2026. Each is rendered upright at `size-4` with stroke width 2 inside a `size-8` ghost Button. The icon pack is pinned to upstream's `@hugeicons/core-free-icons@2.0.0`; the MIT React renderer is `@hugeicons/react@1.1.10`, which supports this app's React version. These three mode-specific icons follow the owner's direction of 30 September 2026.

The local theme logic cycles System → Dark → Light → System. System is the default and follows the device preference; explicit choices persist across reloads. The accessible name and hover title describe the current mode and next action. This is application composition using the MIT icon packages and existing MIT Button; the AGPL shared COSS component is a visual reference.

## CV and ATS export

The web CV and downloadable CV share the same professional content, Inter typography and semantic neutral palette. The PDF exporter may resolve theme variables into browser-ready CSS while preserving their visual values.

The downloadable CV uses a semantic single-column reading order: identity and contact details, summary, technical skills, projects, experience and education. Headings, dates, roles and contact details remain selectable text. Standard headings and direct links make the document readable by people and applicant tracking systems.

Use page margins, line height and print layout to keep the CV readable. Export structure serves document reading; the website can use COSS cards and navigation around the same content. Verify PDF text extraction and visual rendering whenever the exporter or CV layout changes.

## Verification and maintenance

For visual changes, verify light and dark themes, desktop and mobile layouts, keyboard focus and the CV download. For source updates, check component APIs, dependencies and license provenance against the new pinned revision, then update this document and the third-party notice together. Run the project's relevant tests and production build.
