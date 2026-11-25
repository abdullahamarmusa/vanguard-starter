# Deployment and operations

## V1 preview

V1 is a public prototype that uses illustrative data and requires no database or
provider credentials. Do not use its open app routes to onboard customers or
handle private tenant data.

## V2/V3 production deployment shape

When production infrastructure is in scope, deploy the Next.js application as a Node.js service and use one managed
PostgreSQL database in the selected region. Keep web and database networking
private where the host permits. No deployment provider or cloud account has
been selected or modified.

Build an immutable application artifact in CI; run type checking, lint,
formatting, unit tests, database integration tests, and `next build` before
release. Apply reviewed Drizzle migrations as a release step with a migration
role, not during every web process start.

## Production checklist

- Choose a hosting region and document data residency and subprocessors.
- Use a runtime PostgreSQL role that is not a table owner and cannot bypass
  RLS; keep a separate migration role.
- Store `DATABASE_URL`, auth secrets, provider credentials, and encryption keys
  in the host's secret manager. Rotate credentials and never print them.
- Require TLS, secure cookies, rate limits, and tenant authorization on every
  server operation.
- Configure automated encrypted backups and point-in-time recovery; regularly
  test restore procedures.
- Add health checks, structured redacted logs, error monitoring, and database
  connection/latency/lock metrics before onboarding customers.
- Define retention, deletion, export, incident response, and customer support
  procedures.
- Validate payment webhook signatures and idempotency before changing
  entitlements. Do not hardcode unverified prices or legal claims.
- Keep campaign delivery disabled until suppression, unsubscribe, review,
  approval, audit, and provider compliance controls are tested end to end.

## Scaling decisions

Do not add Redis, a job service, an analytics database, or microservices based
only on anticipated scale. Introduce them when recorded workload, reliability,
or team boundaries demonstrate the need and an ADR documents the tradeoff.
