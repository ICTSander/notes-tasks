# Notes → Tasks

A minimal, installable web app that converts messy notes into clear, actionable tasks with automatic planning. Deployable to Vercel with PostgreSQL.

## Features

- **Quick Notes** — Type short, messy sentences and convert them into structured tasks
- **AI Rewrite** — Mock mode (default), or real AI via Anthropic Claude / OpenAI
- **Projects** — Organize tasks by project with color coding
- **Task Overview** — Filter, search, sort by priority/due date, mark as done
- **7-Day Plan** — Automatic scheduling based on priority and time estimates
- **PWA** — Installable on iOS and Android, works from home screen
- **Settings** — Configure daily capacity, workdays, and AI mode

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS v4
- PostgreSQL + Prisma
- Anthropic SDK (Claude) for AI rewriting
- PWA with service worker

---

## Getting Started (Local)

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL) **or** a hosted PostgreSQL (Supabase, Neon, etc.)

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

**Option A: Docker (recommended for local dev)**

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with the default credentials in `.env`.

**Option B: Hosted PostgreSQL**

Use [Supabase](https://supabase.com), [Neon](https://neon.tech), or any PostgreSQL provider. Copy the connection string into `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### 3. Run migrations + seed

```bash
npx prisma migrate dev
```

This creates all tables and seeds sample data (projects + tasks).

To re-seed manually:

```bash
npm run seed
```

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push the repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Supabase, Neon, etc.) |
| `ANTHROPIC_API_KEY` | No | Enables Claude AI for note rewriting |

4. Deploy. Prisma generates the client automatically via `postinstall`.
5. Run migrations against your production database:

```bash
npx prisma migrate deploy
```

Or seed it:

```bash
DATABASE_URL="your-prod-url" npx tsx prisma/seed.mts
```

---

## AI Provider Setup

By default, the app uses **mock AI** — a rule-based rewriter that works without any API keys.

### Anthropic (Claude) — Recommended

Set in `.env` or Vercel environment:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Uses Claude Sonnet via the official Anthropic SDK. If the API call fails, it falls back to mock mode automatically.

### OpenAI (fallback)

```env
OPENAI_API_KEY=sk-...
```

Uses gpt-4o-mini. Anthropic takes priority if both keys are set.

### Settings page

Go to **Settings** and disable "Mock AI Mode" to use the real provider. If no API key is configured server-side, a warning is shown and mock mode stays active.

---

## Install on iOS

1. Open the app in **Safari** on your iPhone/iPad
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

The app launches in standalone mode (no Safari chrome) and supports all tabs/routes.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/notes_tasks` | PostgreSQL connection |
| `ANTHROPIC_API_KEY` | — | Anthropic API key for Claude |
| `OPENAI_API_KEY` | — | OpenAI API key (fallback) |

---

## Project Structure

```
src/
  app/
    layout.tsx        # Root layout + PWA meta
    page.tsx          # Main tasks page
    plan/page.tsx     # 7-day planning view
    settings/page.tsx # Settings (localStorage)
    api/
      rewrite/        # GET (status) + POST (AI rewrite)
      projects/       # CRUD
      notes/          # POST
      tasks/          # CRUD
  components/
    Nav.tsx           # Top bar (desktop) + bottom tabs (mobile)
    NoteInput.tsx     # Note input + review panel
    TaskList.tsx      # Task list with checkboxes
    TaskSidePanel.tsx # Edit task details
    TaskFilters.tsx   # Search + project filter
    ProjectManager.tsx# CRUD projects
    ServiceWorkerRegister.tsx
  lib/
    prisma.ts         # Prisma client singleton
    types.ts          # Shared TypeScript types
    useSettings.ts    # localStorage settings hook
    llm/
      provider.ts     # LLM provider (Anthropic/OpenAI/mock)
      mock.ts         # Mock rewrite logic
public/
  manifest.webmanifest
  sw.js               # Service worker
  icons/              # PWA icons
prisma/
  schema.prisma       # PostgreSQL schema
  seed.mts            # Seed data
docker-compose.yml    # Local PostgreSQL
```
