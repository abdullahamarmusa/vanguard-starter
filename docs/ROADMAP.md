# Development roadmap

## Foundation

- Review the PostgreSQL schema and tenant access model.
- Start the local database and verify generated migrations.
- Select an identity provider only after validating target-customer needs.
- Add PostgreSQL integration tests using a non-owner runtime role.

## Offer-to-Lead MVP

- Create and edit organization-owned offers.
- Capture and review an ideal customer profile.
- Integrate one authorized, licensed source after terms, retention, and region
  are reviewed.
- Store evidence with source attribution, capture time, and expiry.
- Produce validated qualification recommendations and require human review.
- Add audit events and usage records for consequential operations.

## Later, only when validated

- Outreach draft and delivery workflows with suppression and unsubscribe
  enforcement.
- CRM, inbox, and billing provider adapters.
- Durable background processing for work that needs retries.
- Analytics, forecasting, and strategy features informed by real customer
  needs and measured workload.

Campaign sending, payment entitlements, and provider-specific data access are
not enabled by this foundation.
