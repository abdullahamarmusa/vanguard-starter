# Development and testing

## Requirements

- Node.js 24 or newer
- pnpm 11 or newer
- Docker Desktop for the local PostgreSQL service

The environment inspected for the initial setup has Node v24.19.0, npm
11.17.0, pnpm 11.20.0, Git 2.55.0, and 86.29 GB free on E:. Docker and the
PostgreSQL CLI/server are not installed or on PATH.

## Setup

From `E:\VANGUARD`:

```powershell
Copy-Item .env.example .env
docker compose up -d db
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

The example password is local-only and must be replaced for any persistent or
shared environment. `.env` is ignored by Git. Do not commit credentials.
Authentication and third-party integrations remain disabled until a provider
and credentials are selected.

## Commands

| Command             | Purpose                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Run Next.js locally at `http://localhost:3000`.                                                         |
| `pnpm typecheck`    | Generate Next.js route types and run TypeScript without emitting files.                                 |
| `pnpm lint`         | Run the Next.js ESLint configuration.                                                                   |
| `pnpm format:check` | Check formatting.                                                                                       |
| `pnpm test`         | Run focused unit tests with Vitest.                                                                     |
| `pnpm test:e2e`     | Run browser smoke tests with Playwright. Install Chromium with `pnpm exec playwright install chromium`. |
| `pnpm build`        | Create the production build.                                                                            |
| `pnpm db:generate`  | Generate a migration from the Drizzle schema.                                                           |
| `pnpm db:migrate`   | Apply pending migrations using `DATABASE_URL`.                                                          |

## Test strategy

- Unit tests cover deterministic validation and tenant/business invariants.
- PostgreSQL integration tests should cover constraints, migration behavior,
  RLS, transaction-local tenant context, and cross-tenant denial before the
  app stores customer data.
- Playwright tests cover authenticated workflows, role boundaries, empty and
  error states, and mobile navigation once those features exist.
- CI should run typecheck, lint, formatting, unit tests, PostgreSQL integration
  tests, and a production build. Do not mark the database integration suite as
  passing until it has run against PostgreSQL using the restricted runtime
  role.

The initial unit and browser tests do not need a database or credentials.
