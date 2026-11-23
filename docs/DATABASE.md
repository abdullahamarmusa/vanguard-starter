# Database evaluation and schema

## Decision

Use PostgreSQL as the only initial application database, with Drizzle ORM and
versioned SQL migrations. VANGUARD is a shared, multi-tenant web service with
relational organizations, workspaces, memberships, offers, evidence, and
qualification records. Concurrent writes, foreign-key integrity, transactions,
and tenant scoping are core needs.

| Candidate  | Evaluation for this workload                                                                                                                                      | Decision                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| PostgreSQL | Strong relational constraints, concurrent transactions, mature backups, hosted options, and row-level security. Fits the shared SaaS operational store.           | Use as the single source of truth.                                |
| SQLite     | Useful for embedded and local single-user work. Its single-file deployment and write-concurrency model are a poor default for a multi-user, multi-tenant service. | Do not use in production or add as a second development database. |
| DuckDB     | Columnar analytics and exploration are useful for reporting, but it is not the transactional organization/workflow store.                                         | Defer; revisit only with measured analytical workload needs.      |

This avoids a dual-database consistency and operations burden. PostgreSQL
indexes and ordinary reporting queries are sufficient until real workload
measurements show otherwise.

## Hosting and local development

Use the included loopback-only PostgreSQL 17 Docker Compose service for local
development. Docker and PostgreSQL are not installed in the inspected
environment, so this service and migrations were not run here. In production,
choose a managed PostgreSQL provider after evaluating region, backups,
point-in-time recovery, connection pooling, availability, support, and cost.
Neon, Render, Railway, and AWS RDS are candidates, not commitments. Keep
`DATABASE_URL` and migrations provider-neutral.

Production migrations run using a dedicated migration role. The runtime
connection must use a separate least-privilege role and must not own tables or
bypass RLS.

## Initial schema proposal

The migration foundation includes:

| Tables                                                                     | Purpose                                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `users`, `accounts`, `sessions`, `verification_tokens`                     | Auth.js-compatible identity and database sessions; no provider is active yet.                    |
| `organizations`, `organization_memberships`                                | Tenant ownership and application roles.                                                          |
| `workspaces`                                                               | Organization-scoped working areas.                                                               |
| `offers`, `icp_profiles`                                                   | Offer definition and versionable, structured ICP criteria.                                       |
| `companies`, `evidence`                                                    | Prospect entities with source, claim, capture time, and optional expiry.                         |
| `qualification_runs`, `lead_qualifications`, `lead_qualification_evidence` | Reproducible runs, bounded scores, rationale, and traceable evidence links.                      |
| `audit_events`, `usage_events`                                             | Tenant-scoped operational audit and usage measurements.                                          |
| `suppression_entries`                                                      | Organization-scoped suppression using a normalized address hash rather than a raw email address. |

Tenant tables use UUID primary keys and include `organization_id`; workspace
records include `workspace_id`. Composite foreign keys bind child records to
the same tenant/workspace. Scores are constrained to 0–100. The application
schema requires at least one evidence reference for a qualification result;
enforce that invariant in the same transaction that writes the qualification
and its evidence links.

## Tenant access and RLS

RLS is enabled on tenant-owned tables. Policies compare `organization_id` with
`current_setting('vanguard.organization_id', true)`. The
`inTenantTransaction` helper validates the UUID and sets the value with
transaction-local `set_config(..., true)`, which resets on commit/rollback and
does not leak through connection pools.

The helper is not a complete authorization system: authenticate the user,
check membership and role, derive the tenant server-side, then enter the
transaction. The runtime database role must not own the tables or have
`BYPASSRLS`. Before production, add PostgreSQL integration tests that run as
that role and prove cross-tenant reads and writes are rejected.

## Migration and backup policy

Generate and commit reviewed migrations with `pnpm db:generate`; apply them
with `pnpm db:migrate`. Do not use schema push against production. Backups and
point-in-time recovery are deployment requirements; define retention, restore
drills, deletion, and data-export behavior before customer onboarding.

No live database, production credential, sample tenant, or customer data is
included in this repository.
