# Security audit

**Scope:** public V1 prototype behavior and source-code V2 groundwork. This is a repository review, not a penetration test, legal opinion, or production certification.

## V1 security boundary

V1 is intentionally public and unauthenticated. There is no user account, organization authorization, or private customer record in the V1 app route tree. The global notice labels sample data and simulated actions. Prototype settings and invitations update local UI state only. The demo must not be used to process real customer records or as a deployed multi-tenant service.

## Findings

| Finding                                    | Status                    | Notes / action                                                                                                                                                                                                                       |
| ------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public app routes have no account boundary | INTENTIONAL FOR V1        | V1 has sample data only. Auth is deferred to V2; do not treat route visibility as authorization.                                                                                                                                     |
| V1 form actions can appear operational     | MITIGATED                 | App-shell notice, sample identities, preview-only settings, preview invitation message, and non-billing plan actions now explain simulation. Review any new interaction for the same requirement.                                    |
| Secrets in browser bundle                  | NO V1 SECRET USE OBSERVED | `.env.example` uses placeholders/local-only examples; server email code uses non-public env names. No live key values were printed or added. Recheck client bundles during V2 deployment.                                            |
| Tenant isolation                           | TESTED SOURCE FOUNDATION  | PostgreSQL RLS policies use organization context and a membership predicate; integration suite passed against the configured local database using the restricted runtime URL. This does not prove every future route is tenant-safe. |
| Membership/role checks                     | PARTIAL V2 FOUNDATION     | Helpers and server actions check membership/roles in transactions; invitations and role mutation are not implemented as V1 server workflows. Review every V2 server action independently.                                            |
| Password/token handling                    | V2 SOURCE FOUNDATION      | Password hashing and expiring one-time token hashes exist. Auth.js route/forms are disabled from V1. Production secret, cookie, session, reset, and account-enumeration review remains required.                                     |
| Email delivery                             | NOT LIVE                  | Resend code exists but provider config was absent. No email delivery was claimed or tested live.                                                                                                                                     |
| Webhooks/billing/newsletter                | NOT IMPLEMENTED           | No Polar or Brevo webhook/API paths were found. No client-supplied plan status is used as production authorization because there is no live entitlement layer.                                                                       |
| Legal/privacy/security content             | DRAFT ONLY                | Draft placeholders remain, including legal entity and contact details. Do not publish as final terms or compliance assertions.                                                                                                       |
| Monitoring/incident response               | NOT CONFIGURED            | No monitoring integration or incident response process was found in source/config.                                                                                                                                                   |

## V2 checks required before exposing account features

- Configure and rotate a strong `NEXTAUTH_SECRET`, correct public origin, PostgreSQL roles, and Resend key/from domain in a secret manager.
- Restore and test the Auth.js route and account UI only as part of V2; test registration, email verification/reset, session revocation, callbacks, and abuse/rate controls end to end.
- Review every server action for authentication, authorization, schema validation, CSRF assumptions, idempotence, and safe error handling.
- Verify migrations on a clean database and under least-privilege migration/runtime roles; verify RLS cannot be bypassed by app runtime permissions.
- Add reviewed webhook signature verification/idempotency before any billing provider can change entitlements.
- Add explicit marketing consent, suppression, unsubscribe, and re-subscription protections before newsletter synchronization.
- Complete privacy, DPA, terms, retention, subprocessors, data residency, incident response, backup/restore, and legal review before production use.
