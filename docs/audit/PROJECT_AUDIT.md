# VANGUARD repository audit

**Audit date:** 2026-11-25  
**Scope:** V1 public prototype checkpoint, following the owner's clarification that authentication, billing, and email belong to V2.  
**Evidence:** inspected source, scripts, routes, schema/migrations, test runs, Git metadata, and local environment variable presence. Secret values were not printed.

## V1 outcome

The app now opens directly into a public, unauthenticated product preview. The marketing site and the application shell share one codebase; product records and state changes are illustrative and do not create accounts, persist to a server, contact a provider, or send outreach. A global prototype notice states these limits. The V1 experience needs no database or third-party credentials.

**Checkpoint status:** ready for the owner's commit and clone after the reported checks pass. This is a prototype readiness signal, not a claim that VANGUARD is production-ready. No commit, tag, clone, remote update, or deployment was made.

## Initial repository and Git state

- Branch: `audit/vanguard-platform-baseline`, tracking `origin/audit/vanguard-platform-baseline`.
- HEAD at inspection: `1b422ac` (`feat: add VANGUARD dashboard and landing experience`); immediately preceding commits were `39c9ac7` and `17e004e`.
- Remote: `origin` points to the VANGUARD GitHub repository.
- No tags were present at inspection.
- The worktree was already dirty before this V1 clarification, with changes to database migrations, schema, app UI, configuration, tests, marketing and demo assets, and additional untracked files. This audit did not reset, clean, commit, or discard that state. The final worktree also includes the V1 changes and audit documentation described here.
- `nul` was already an untracked item at initial inspection. The Playwright run generated `debug.log`; it is a test artifact and is removed before handoff.

## Verified stack and repository structure

| Area                     | Observed implementation                                                                                                                                                                                                                   | Classification                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Web framework            | Next.js 16.4.6 App Router, React 19.3.0, TypeScript, Tailwind CSS 4.3.3, Cache Components enabled                                                                                                                                         | VERIFIED                                       |
| UI                       | Shared design tokens/components under `src/components`, feature views under `src/features`, responsive marketing under `src/components/marketing` and `src/app/marketing.css`                                                             | VERIFIED                                       |
| Product routes           | Marketing home; dashboard, analyze, prospects, campaigns, workspace, reports, agents, members, billing, audit logs, roadmap, and settings                                                                                                 | VERIFIED UI; data is illustrative              |
| State/data               | `src/store/prototype-context.tsx`, `src/lib/data-access/mock-adapter.ts`, and `src/mocks/*`; several preview interactions mutate client state only                                                                                        | MOCKED / SIMULATED                             |
| Database                 | PostgreSQL with `postgres` driver and Drizzle ORM 0.45.4; schema and SQL migrations in `src/server/db` and `drizzle/`                                                                                                                     | VERIFIED V2 FOUNDATION; unused by V1 routes    |
| Authentication           | Auth.js Credentials code, account/token actions, membership and tenant helpers exist in the worktree. V1 account URLs redirect to `/dashboard`; the V1 product route layout has no session gate and the Auth.js API route is not exposed. | V2 FOUNDATION; DISABLED IN V1                  |
| Transactional email      | Resend REST adapter posts to `https://api.resend.com/emails`; verification/reset actions call it. No V1 route calls those actions, and this checkout has no usable Resend key/sender configured.                                          | PARTIALLY IMPLEMENTED FOR V2; NOT A V1 FEATURE |
| Billing/newsletter       | No Polar or Brevo adapter, endpoint, webhook handler, or connected checkout/subscription/newsletter workflow found. V1 plan picker is now a local preview with prices unset.                                                              | NOT IMPLEMENTED; DEFERRED                      |
| Jobs                     | No background worker or job scheduler found.                                                                                                                                                                                              | NOT IMPLEMENTED                                |
| Validation               | Zod appears in request/action validation and `src/lib/validation.ts`; prototype forms mostly use browser/local-state validation.                                                                                                          | PARTIAL                                        |
| Tests                    | Vitest unit and PostgreSQL integration tests; Playwright E2E and PWA configurations.                                                                                                                                                      | VERIFIED INFRASTRUCTURE                        |
| Deployment/observability | `compose.yaml` and operational documentation exist. No provider-specific deployment manifest, CI workflow, monitoring SDK, or incident process was found in the inspected files.                                                          | PARTIAL / NOT CONFIGURED                       |
| Legal copy               | Six legal/trust routes are generated from `src/content/legal.ts` and explicitly marked as drafts/placeholders.                                                                                                                            | UI PRESENT; NOT READY TO PUBLISH               |

## V1 journey and behavior findings

- Marketing calls to action open public app routes without requiring an account.
- `/dashboard` and all application pages use mock adapter data and the prototype context.
- V1 now has an explicit persistent app-shell notice explaining that records are illustrative and actions are simulated; billing copy no longer exposes draft dollar amounts or implies a connected provider.
- Account, recovery, verification, and onboarding URLs resolve to the public demo. Profile, organization, team, and security settings no longer query account/tenant tables in V1.
- Team invitations only add a local preview record and explicitly say no email was sent. Campaign actions are preview actions; sending is not connected.
- Product mock data includes fictitious `.example` identities. Marketing examples and testimonial cards are identified as illustrative/reference material.
- A public non-authenticated app is intentional in V1; it contains no customer database reads. Do not deploy this public mock shell as an authenticated customer product.

## Prioritized implementation and completed V1 fixes

1. **Unblock the stated V1 journey:** removed the session requirement from the product layout, removed the Auth.js Proxy/API route from the V1 request path, redirected account/onboarding URLs to the demo, and changed marketing CTAs to preview routes.
2. **Keep the prototype honest:** added the persistent disclosure; replaced account-backed settings with local illustrative forms; corrected invite messaging; unset unapproved plan prices and made plan selection explicitly non-billing.
3. **Keep personal details out of the public sample:** replaced the real owner name/email in prototype identity data with Alex Morgan and an `.example` address.
4. **Verify the changed journey:** updated Playwright checks for public navigation, account-route redirects, legal status, product routes, and responsive layouts. Final command results are recorded in `docs/FINAL_EXECUTION_REPORT.md`.
5. **Keep later work distinct:** Polar, Brevo, production identity, and provider configuration remain deferred to V2/V3. No credentials, tags, commits, or clones were created.

## V1 vs V2 vs V3 classification

- **V1 prototype:** marketing pages, shared shell, dashboard/features, sample tables/charts, empty states, local preview interactions, legal draft pages, and PWA foundation.
- **Reusable V2 candidates:** PostgreSQL/Drizzle schema and migrations, Auth.js server code, Resend adapter, tenant helper/RLS work, settings patterns, validation, and common UI. Their existence in source is not proof of production readiness; V1 does not mount them as account flows.
- **VANGUARD-only V3:** offer intelligence, ICP/discovery/qualification examples, prospects, campaign preparation, evidence views, reports, and agent examples. At this checkpoint they are UI and illustrative client state, not a connected data/AI/outreach engine.
- **Shared candidates:** design system, route/layout patterns, database/auth/email infrastructure after hardening, and test conventions. Product terminology and mock records should not enter a generic V2 boilerplate unchanged.

## Deferred / not claimed

Polar billing, Brevo consent/newsletter flows, production auth/email configuration, subscription entitlements, provider webhooks, licensed data APIs, real AI jobs, campaign delivery, operational logging/monitoring, legal review, CI/deployment verification, and repository extraction have not been completed as part of the V1 checkpoint.
