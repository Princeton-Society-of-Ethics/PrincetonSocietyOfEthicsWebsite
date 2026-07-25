# Princeton Society of Ethics — Website

The official website of the **Princeton Undergraduate Society of Ethics**, built with React, TypeScript, and Tailwind CSS, and hosted on [Vercel](https://vercel.com).

## Tech Stack

| Tool | Purpose |
| --- | --- |
| [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | UI framework with strict typing |
| [Vite](https://vite.dev) | Dev server and production bundler |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling (design tokens live in `src/index.css`) |
| [React Router](https://reactrouter.com) | Client-side routing |
| [lucide-react](https://lucide.dev) | Icons |
| ESLint + Prettier | Linting and formatting |

## Getting Started

### 1. Prerequisites

- **Node.js 24** (any version ≥ 20.19 works). Check with `node --version`.
  - Install via [nodejs.org](https://nodejs.org), or with a version manager like [mise](https://mise.jdx.dev) (`mise use node@24`) or [nvm](https://github.com/nvm-sh/nvm) (`nvm install 24`). The repo's `.node-version` file tells these tools which version to pick automatically.
- **Git**, and access to the [Princeton-Society-of-Ethics](https://github.com/Princeton-Society-of-Ethics) GitHub organization.

### 2. Clone and install

```bash
git clone https://github.com/Princeton-Society-of-Ethics/PrincetonSocietyOfEthicsWebsite.git
cd PrincetonSocietyOfEthicsWebsite
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

Open the printed URL (usually http://localhost:5173). The page hot-reloads as you edit files.

### All commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check without building |
| `npm run lint` | Run ESLint over `src/` |
| `npm run format` | Auto-format the whole repo with Prettier |

Before opening a pull request, make sure `npm run build` and `npm run lint` both pass.

## Project Structure

```
public/                  Static assets served as-is (images, audio)
  images/                Logos, team photos, event galleries
src/
  content/               ★ All site text and data, strongly typed
    site.ts              Org name, navigation links, social links
    team.ts              Advisors and team member rosters
    initiatives.ts       Initiative descriptions + photo gallery data
    join.ts              FAQ and "how to join" steps
    magazine.ts          Telos issues and articles
    episodes.ts          Interview Series podcast episodes
  components/
    layout/              Page shell: Navigation, Footer, PageLayout, Logo
    sections/            Reusable page sections (PageHero, CtaBanner, ...)
      home/              Sections used only on the home page
    ui/                  Small primitives: Button, Input, Textarea, Label
  pages/                 One component per route
  lib/
    api/                 Typed HTTP client + backend service modules
    utils.ts             `cn()` class-name helper
  App.tsx                Route table
  index.css              Tailwind theme: colors, fonts, animations
```

### Making common edits

Most updates only touch `src/content/` — no component changes needed:

- **Add/remove a team member** → edit `src/content/team.ts`. Put their photo in `public/images/team/` and reference it via `imageSrc`.
- **Update navigation** → edit `src/content/site.ts`.
- **Add a podcast episode** → drop the audio file in `public/audio/interviews/` and add an entry in `src/content/episodes.ts`.
- **Change colors/fonts** → edit the `@theme` block in `src/index.css`.

### Adding a new page

1. Create `src/pages/YourPage.tsx`. Compose it from the shared sections (`PageHero`, `CtaBanner`, `SectionHeading`) so it matches the site's look.
2. Add a `<Route>` in `src/App.tsx`.
3. Link to it from `src/content/site.ts` if it belongs in the navigation.

## Backend / API Layer

The site is fully static today, but it is ready to talk to a backend:

- `src/lib/api/client.ts` is a small typed `fetch` wrapper that reads the base URL from the `VITE_API_BASE_URL` environment variable.
- `src/lib/api/membership.ts` shows the service-module pattern (join inquiries, newsletter signups). Add one module per API area.
- When no backend is configured, forms degrade gracefully with a friendly message — nothing crashes.

To enable a backend: set `VITE_API_BASE_URL` in `.env.local` for local dev (see `.env.example`), and in **Vercel → Project → Settings → Environment Variables** for deployments.

## Deployment (Vercel)

The site deploys on Vercel; `vercel.json` already configures SPA rewrites (so deep links like `/team` work) and long-term caching for hashed assets.

One-time setup, done by an org admin at [vercel.com](https://vercel.com):

1. **Add New… → Project**, and import `Princeton-Society-of-Ethics/PrincetonSocietyOfEthicsWebsite`.
2. Vercel auto-detects Vite. Keep the defaults (build command `npm run build`, output directory `dist`).
3. Click **Deploy**.

After that, every push to `main` deploys to production automatically, and every pull request gets its own preview URL posted in the PR — use those previews to review visual changes.

## Contributing Workflow

1. Create a branch: `git checkout -b your-name/short-description`
2. Make your changes; check them locally with `npm run dev`.
3. Run `npm run build` and `npm run lint`.
4. Push and open a pull request. Review the Vercel preview link before merging.
