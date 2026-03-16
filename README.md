# 0xBase Documentation

0xBase is a production-ready Next.js 16 scaffold that ships with auth, database,
i18n, theming, and a clean extractable service layer — so you start building features
on day one instead of wiring infrastructure.

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-fork>
cd 0xBase
bun install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres pooled connection URL |
| `BETTER_AUTH_SECRET` | Random 32-byte secret — `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Full public URL of your app (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |

All variables are validated at startup via Zod in `src/lib/env.ts`. The app will crash
immediately with a clear message if any required variable is missing.

### 3. Set up the database

```bash
bun run db:reset   # drops and recreates schema, applies all migrations
```

Or to apply migrations on top of an existing database:

```bash
bun run db:migrate
```

### 4. Start the dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

0xBase follows a strict vertical-slice architecture with a hard layer contract.
Nothing skips a layer.

```
Client Component
    ↓
Server Action / Route Handler   (thin — parse, call, respond)
    ↓
Feature Service                 (business logic, validation, orchestration)
    ↓
packages/db / Drizzle           (typed queries, no raw SQL)
    ↓
Neon Postgres
```

### Feature slices

Every domain lives in `src/features/<name>/`:

```
src/features/profile/
  service.ts    ← pure functions, Drizzle queries, no Next.js APIs
  actions.ts    ← "use server", Zod validation, session from auth
```

Services are intentionally framework-agnostic — they can be extracted to a standalone
Hono API with zero rewrites.

### Route groups

| Group | Path | Purpose |
|---|---|---|
| `(auth)` | `/login`, `/onboarding` | Unauthenticated flows |
| `(protected)` | `/profile` | Wrapped in `<AuthGuard>` |
| root | `/`, `/docs` | Public pages |

---

## Features

### Authentication

Built on [Better Auth](https://better-auth.dev) with a Drizzle adapter.

- Google and GitHub OAuth out of the box
- Session verified on every protected request via `auth.api.getSession()`
- `AuthGuard` server component redirects unauthenticated users to `/login`
- `signOut()` from `better-auth/react` clears the session client-side

To add a new OAuth provider, add the credentials to `.env.local` and extend
`socialProviders` in `src/lib/auth.ts`.

### Database

[Drizzle ORM](https://orm.drizzle.team) on [Neon Postgres](https://neon.tech).

- Schema lives in `drizzle/schema.ts`
- Migrations are generated with `bun run db:generate` and applied with `bun run db:migrate`
- Never modify production schema manually — always go through migrations
- All queries are typed; use `.select({ col: table.col })` to query only needed columns
- Use transactions for multi-table writes: `db.transaction(async (tx) => { ... })`

### Internationalisation (i18n)

Powered by [next-intl](https://next-intl.dev) with cookie-based locale detection
(no URL routing).

- Supported locales: `en`, `ar`, `ur`, `hi`
- RTL is applied automatically for `ar` and `ur` via `dir="rtl"` on `<html>`
- Translation files live in `messages/<locale>.json`
- Change locale via the `<LocaleSwitcher>` dropdown — it writes to a cookie and reloads
- Add a new locale by adding it to `project.locales` in `src/config/project.ts`,
  creating `messages/<locale>.json`, and registering direction rules in `src/app/layout.tsx`

### Theming

[next-themes](https://github.com/pacocoursey/next-themes) with CSS custom properties.

- Default theme: `dark` (configurable in `src/config/project.ts`)
- All colours are CSS tokens defined in `src/styles/tokens.css` — edit that file to
  retheme the entire app
- `ThemeProvider` in `Providers.tsx` sets `attribute="class"` so the `.dark` class
  toggles the token set
- The `<ThemeToggle>` component is hydration-safe (renders nothing until mounted)

### Type Safety

TypeScript strict mode is enabled. All function parameters and return types are
explicitly typed. Zod is used at every API boundary.

- Runtime validation in server actions: `z.string().min(1).max(50).trim().safeParse(value)`
- Use `satisfies` over `as` for type assertions
- Never use `any` — derive or define the type instead

### Dev Experience

- **Biome** for linting and formatting (`bun run lint`, `bun run lint:fix`)
- **TypeScript** strict type-checking (`npx tsc --noEmit`)
- **`bun run db:reset`** — full schema reset for a clean dev slate
- `src/config/project.ts` is the single source of truth for app-wide constants:
  name, locales, default theme, protected routes, onboarding config

---

## API Conventions

Route handlers are thin wrappers — 10–20 lines maximum. All business logic lives
in the service layer.

```typescript
// ✅ Correct — thin handler
export async function POST(req: Request) {
  const body = await req.json()
  const result = await myService.doThing(body)
  return Response.json(result)
}

// ❌ Wrong — business logic in a handler
export async function POST(req: Request) {
  const { userId } = await req.json()
  const user = await db.select().from(users).where(eq(users.id, userId))
  // ... 40 more lines
}
```

Server Actions follow the same rule — validate with Zod, call a service, return a
typed result.

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local` to the Vercel project settings
4. Deploy — Next.js is detected automatically

### Database migrations in production

Run migrations before each deployment:

```bash
bun run db:migrate
```

Or add it as a build step in `package.json`:

```json
"build": "bun run db:migrate && next build"
```

Never run `db:reset` in production — it drops all data.

---

## Project Structure

```
0xBase/
├── drizzle/              Schema + migration files
├── messages/             Translation files (en, ar, ur, hi)
├── src/
│   ├── app/              Next.js App Router pages + layouts
│   │   ├── (auth)/       Login + onboarding
│   │   ├── (protected)/  Auth-guarded pages
│   │   └── docs/         This documentation
│   ├── components/
│   │   ├── auth/         OAuthButtons
│   │   ├── features/     Feature-scoped client components
│   │   ├── layout/       Nav, SignOutButton
│   │   └── ui/           ThemeToggle, LocaleSwitcher
│   ├── config/           project.ts — app-wide constants
│   ├── content/          Locale-specific MDX content (docs)
│   ├── features/         Vertical slices (profile, auth)
│   ├── i18n/             next-intl config + locale actions
│   ├── lib/              auth.ts, session.ts, env.ts
│   └── styles/           globals.css, tokens.css
```
