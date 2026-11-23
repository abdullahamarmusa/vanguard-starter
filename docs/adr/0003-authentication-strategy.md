# ADR 0003: Auth.js and application-owned authorization

- Status: Accepted
- Date: 2026-11-23

## Context

VANGUARD requires organization memberships, role-based permissions, and
revocable sessions but has no selected identity provider, SSO requirements, or
credentials yet. Tenant roles must not be coupled to claims supplied by an
external provider.

## Decision

Use Auth.js with database-backed sessions when identity-provider requirements
are confirmed. Keep organizations, membership, and authorization policy in
the application database. Do not expose sign-in or claim a provider is
configured until that integration is implemented and tested.

## Consequences

Authentication is intentionally incomplete in the foundation. Provider
selection, account recovery, email verification, MFA/SSO requirements, and
session lifecycle need a separate implementation and security review.
