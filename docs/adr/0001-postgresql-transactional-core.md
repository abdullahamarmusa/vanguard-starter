# ADR 0001: PostgreSQL for the transactional core

- Status: Accepted
- Date: 2026-11-23

## Context

VANGUARD is a multi-tenant web application with concurrent users, relational
organizations/workspaces, offers, evidence, and auditable qualification
workflows. Tenant isolation and transactional integrity matter more than
embedded deployment or analytical scan speed.

## Decision

Use one PostgreSQL database for application state, with Drizzle ORM, reviewed
SQL migrations, tenant-scoped composite constraints, and row-level security as
defense in depth. Host it with a managed provider selected after region,
recovery, pooling, availability, support, and cost needs are known.

## Alternatives

- SQLite is suitable for embedded and small single-node workloads, but is not
  the initial shared SaaS store.
- DuckDB is suited to analytical workloads, but is not the transactional source
  of truth. Do not add a second database until measured reporting needs justify
  its consistency and operations cost.
- A vendor-specific backend such as Supabase is not required by the product
  requirements and is not selected.

## Consequences

PostgreSQL is a required local/production service. The project needs migration
discipline, backup/restore drills, least-privilege runtime credentials, and
integration tests for tenant boundaries. Hosting stays provider-neutral.
