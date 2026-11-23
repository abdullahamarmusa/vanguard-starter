# VANGUARD

VANGUARD is an independent commercial SaaS project for AI business intelligence
and revenue operations. Its first workflow is **Offer-to-Lead Intelligence**:
help small software agencies turn a clear offer into evidence-backed,
human-reviewed prospects.

This repository is a foundation, not a production-ready sales system. It has no
configured customer database, identity provider, enrichment source, or campaign
sender. No customer data or provider credentials are included.

## Development

Requirements: Node.js 24+, pnpm 11+, and Docker Desktop when using the local
PostgreSQL service. The current development environment did not have Docker or
PostgreSQL installed.

```powershell
Copy-Item .env.example .env
docker compose up -d db
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Open <http://localhost:3000>. Replace the example local-only password before
using the database beyond a disposable development machine. Never copy example
values into production.

Useful checks:

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm format:check
```

`pnpm test:e2e` requires a Playwright browser installation (`pnpm exec
playwright install chromium`). Database migration commands require a running
PostgreSQL instance and a valid `DATABASE_URL`.

## Architecture

- [Product and MVP scope](docs/PRODUCT.md)
- [System architecture and security boundaries](docs/ARCHITECTURE.md)
- [Database evaluation, schema, and migration policy](docs/DATABASE.md)
- [Development and testing](docs/DEVELOPMENT.md)
- [Deployment and operations](docs/DEPLOYMENT.md)
- [Development roadmap](docs/ROADMAP.md)
- [Architecture decision records](docs/adr/)

The application is a TypeScript Next.js modular monolith. PostgreSQL is the
single transactional database. SQLite and DuckDB are not part of this design;
see the documented evaluation before revisiting that decision.

## Commercial and data-use boundaries

Use authorized APIs and licensed data sources only. Do not scrape sources
without permission. Outreach must respect tenant suppression and unsubscribe
records, and sending must require explicit human approval. AI output is
untrusted input: server-side validation and business rules remain authoritative.
Pricing, legal terms, data-retention periods, and provider choices require
separate review before launch.
