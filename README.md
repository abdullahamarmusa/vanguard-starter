# VANGUARD

VANGUARD is an independent commercial SaaS project for AI business intelligence
and revenue operations. Its first workflow is **Offer-to-Lead Intelligence**:
help small software agencies turn a clear offer into evidence-backed,
human-reviewed prospects.

This checkout is VANGUARD's public V1 product prototype. It uses illustrative
records and simulated, browser-local interactions. No account, payment, email,
live data provider, or campaign delivery is connected. It is not a production
sales system. Authentication and provider infrastructure are a separate V2
workstream and are not required to run the V1 preview.

## Development

Requirements: Node.js 24+ and pnpm 11+. V1 runs without PostgreSQL, Docker, or
third-party credentials. PostgreSQL is only needed for database integration
tests and the separate V2 platform groundwork.

```powershell
pnpm install
pnpm dev
```

Open <http://localhost:3000> and choose **Explore preview**. The app routes are
public; sign-in, registration, password recovery, verification, and onboarding
URLs return to the prototype because V1 has no accounts.

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
playwright install chromium`). PostgreSQL integration tests require local DB
credentials; those are not needed for the public V1 experience.

## Architecture

- [Product and MVP scope](docs/PRODUCT.md)
- [System architecture and security boundaries](docs/ARCHITECTURE.md)
- [Database evaluation, schema, and migration policy](docs/DATABASE.md)
- [Development and testing](docs/DEVELOPMENT.md)
- [Responsive web and PWA foundation](docs/PWA.md)
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
