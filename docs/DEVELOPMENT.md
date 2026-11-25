# Development and testing

## V1 prototype requirements

- Node.js 24 or newer
- pnpm 11 or newer
- No database or external provider is required for V1.

The environment inspected for the initial setup has Node v24.19.0, npm
11.17.0, pnpm 11.20.0, Git 2.55.0, and 86.29 GB free on E:. Docker and the
PostgreSQL CLI/server are not installed or on PATH.

## Setup

From `E:\vanguard`:

```powershell
pnpm install
pnpm dev
```

V1 serves public product routes using illustrative data and local preview state.
Auth.js, PostgreSQL account tables, and the Resend transactional email adapter
remain V2 groundwork, but the V1 route tree does not expose or invoke those
account flows. Configure the V2 environment and database separately when that
checkpoint begins. Never commit credentials.

## Commands

| Command             | Purpose                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Run Next.js locally at `http://localhost:3000`.                                                         |
| `pnpm typecheck`    | Generate Next.js route types and run TypeScript without emitting files.                                 |
| `pnpm lint`         | Run the Next.js ESLint configuration.                                                                   |
| `pnpm format:check` | Check formatting.                                                                                       |
| `pnpm test`         | Run focused unit tests with Vitest.                                                                     |
| `pnpm test:db`      | Run PostgreSQL tenant-isolation tests with migration and runtime URLs set; not needed for V1 preview.   |
| `pnpm test:e2e`     | Run browser smoke tests with Playwright. Install Chromium with `pnpm exec playwright install chromium`. |
| `pnpm test:pwa`     | Run production service-worker and offline checks after `pnpm build`.                                    |
| `pnpm build`        | Create the production build.                                                                            |
| `pnpm db:generate`  | Generate a migration from the Drizzle schema.                                                           |
| `pnpm db:migrate`   | Apply pending migrations using `MIGRATION_DATABASE_URL`.                                                |

## Test strategy

- Unit tests cover deterministic validation and tenant/business invariants.
- PostgreSQL integration tests should cover constraints, migration behavior,
  RLS, transaction-local tenant context, and cross-tenant denial before the
  app stores customer data.
- Playwright tests cover public product journeys, prototype interactions,
  navigation, responsive layouts, empty states, and mobile navigation.
- CI should run typecheck, lint, formatting, unit tests, PostgreSQL integration
  tests, and a production build. Do not mark the database integration suite as
  passing until it has run against PostgreSQL using the restricted runtime
  role.

The PostgreSQL suite is skipped when either database URL is missing. CI starts
PostgreSQL, applies migrations as the migration role, and runs it as the
restricted runtime role.
