# Production readiness

## Decision

**V1 prototype checkpoint: ready for local preview, review, commit, and clone once the final listed checks pass.** The public V1 is not an authenticated customer SaaS and must not be described as production-ready. Its purpose is to demonstrate product journeys with illustrative data and simulated interactions.

## Acceptance matrix

| Criterion                           | Result                   | Evidence / limitation                                                                                                                                        |
| ----------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public marketing and app routes     | PASS                     | App routes no longer require auth; Playwright checks visit all core product destinations.                                                                    |
| Clear demo status                   | PASS                     | Persistent app-shell notice; mock identity uses `.example`; billing copy has no draft amount; invite action says no email was sent.                          |
| Authentication required for V1      | NOT APPLICABLE           | V1 has no accounts by design. Account/onboarding URLs route to the public preview.                                                                           |
| PostgreSQL required to run V1       | PASS                     | V1 product route group uses mock adapter/client state and can be built without database-backed route reads. DB is used only by optional V2 groundwork/tests. |
| Responsive layouts                  | PASS pending final rerun | E2E viewport matrix covers marketing and app at phone/tablet/desktop sizes.                                                                                  |
| Accessibility interactions          | PARTIAL PASS             | Browser checks cover semantic navigation, keyboard focus, reduced motion, and keyboard-operated evidence tabs; no independent full WCAG audit performed.     |
| Resend delivery                     | NOT APPLICABLE to V1     | V2 source adapter exists; credentials/sender are not configured, and no live delivery was attempted.                                                         |
| Polar billing                       | NOT IMPLEMENTED          | Deferred to V2/V3. Plan selection is illustrative only.                                                                                                      |
| Brevo newsletter                    | NOT IMPLEMENTED          | Deferred to V2/V3. No consent/contact integration exists.                                                                                                    |
| Production legal content            | BLOCKED                  | Privacy, terms, cookies, acceptable use, security, and DPA pages still contain draft placeholders.                                                           |
| CI and deployment                   | NOT VERIFIED             | No selected production host or CI workflow was found; no deployment was made.                                                                                |
| Logging/monitoring/backups/recovery | NOT CONFIGURED           | Operational controls require a V2/V3 deployment design and evidence.                                                                                         |
| VANGUARD product backend            | NOT IMPLEMENTED          | Analysis/prospect/campaign/report/agent UI reads illustrative data; no live provider, durable workflow store, or campaign sender.                            |
| Git checkpoint/clone                | OWNER ACTION             | No commit/tag/clone was made; the user asked to perform these after receiving the V1 signal.                                                                 |

## External setup

V1 preview needs no provider credentials or database. V2 groundwork will require PostgreSQL and Auth.js secrets plus a verified Resend sender and API key for transactional email. Polar seller onboarding and Brevo account/list/consent setup are not implemented or verified. Do not place credentials in Git.
