# ADR 0002: TypeScript modular monolith

- Status: Accepted
- Date: 2026-11-23

## Context

The first product workflow spans offer setup, evidence, qualification, and
review. A small initial team needs one deployable application and typed
server-side business rules; separate frontend, API, and worker services would
add operational boundaries before workload or ownership requires them.

## Decision

Use Next.js App Router, React, strict TypeScript, and Tailwind CSS in one
modular monolith. Keep route composition, feature logic, server-only services,
and UI components in explicit directories. Add background processing only
when durable retries or provider latency require it.

## Consequences

The application can evolve without early service orchestration. Modules must
keep provider access and tenant authorization server-side; split a service
later only with workload evidence and an ADR.
