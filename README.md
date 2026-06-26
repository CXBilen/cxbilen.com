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
