# System architecture

## Application shape

Start with a TypeScript Next.js App Router modular monolith. Server Components
render read paths; server-only modules own database access, authorization,
integration calls, and business rules. Keep feature code under
`src/features/offer-intelligence` and shared UI under `src/components`.
Introduce separate services only when measured reliability, scaling, or team
ownership needs justify the operational cost.

## Boundaries

- `src/app/`: route composition and metadata; not a place for provider secrets
  or direct tenant queries.
- `src/features/offer-intelligence/`: offer and qualification schemas and
  workflow-specific logic.
- `src/server/`: database, identity, authorization, integrations, audit, and
  server-side business rules.
- `drizzle/`: generated, reviewed PostgreSQL migrations.
- `tests/`: browser-level workflows; focused unit tests stay beside the code
  they exercise.

Validate request inputs at typed API/server-action boundaries with Zod. Treat
model output, provider responses, imported data, and user-supplied URLs as
untrusted. Use parameterized ORM queries; do not expose arbitrary SQL tools to
models or clients.

## Authentication and authorization

The selected direction is Auth.js with database-backed sessions and an
application-owned organization membership/role model. No identity provider is
selected or configured yet, so sign-in is intentionally not exposed. When
enabled, validate the session server-side, resolve the active organization
through a membership check, and check the required role for every operation.
Never trust an organization ID or role supplied only by the browser.

The initial role vocabulary is owner, admin, member, and analyst. Permissions
must be explicit by operation; role names alone are not authorization logic.
Evaluate SSO requirements with target customers before selecting an identity
provider or adding enterprise claims.

## Tenant isolation and security

Every tenant-owned row carries an `organization_id`; workspace-scoped records
also carry a `workspace_id`. Composite foreign keys prevent records from
linking across organizations or workspaces. PostgreSQL row-level security
policies require a transaction-local
`vanguard.organization_id` set through `inTenantTransaction`.

RLS is defense in depth, not a substitute for application membership checks.
Production must use a least-privilege runtime database role that does not own
the tables and does not have `BYPASSRLS`; use a separate migration role. Keep
each tenant operation within the scoped transaction so pooled connections
cannot retain context. Add integration tests for both cross-tenant reads and
writes before handling real data.

Use TLS to hosted services, secure and HTTP-only session cookies, CSRF defenses
from the auth framework, strict input validation, rate limits on costly
operations, and a documented retention/deletion policy. Keep secrets in the
deployment secret store; encrypt provider credentials with a managed
key-encryption strategy before adding integrations. Never log access tokens,
raw contact data, or model prompts containing customer secrets.

## AI and provider integrations

Define internal provider interfaces for models, licensed data sources,
enrichment, CRM, email, billing, and observability when a real integration is
selected. Keep provider-specific DTOs behind adapters and normalize only the
fields the product needs. Respect provider terms, data residency, attribution,
retention, and customer consent.

Model responses must be parsed against versioned structured schemas. A
qualification score must cite evidence; deterministic server rules check
eligibility and permissions. A person reviews outputs before outreach, and the
server enforces suppression/unsubscribe checks at send time. Models cannot
execute SQL, alter permissions, grant billing entitlements, or send campaigns.

## Audit and metering

Record append-only audit events for organization membership changes, data
imports, qualification decisions, exports, and future campaign approvals.
Usage events should describe billable operations with tenant scope and units.
Keep billing entitlements separate from usage observations; only a verified
payment-provider webhook may change entitlements. Verify signatures, event
identity, replay/idempotency, and entitlement state before granting access.

## Background work

Do not add a queue to the foundation. Once provider calls or imports need
durable retries, choose a PostgreSQL-backed job system or a managed queue based
on measured duration, retry, concurrency, and isolation needs. Jobs must carry
tenant and actor context, be idempotent, and emit audit events.
