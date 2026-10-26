# DreamTable: single-restaurant installation architecture

Decision: each customer receives a separate deployment, database, domain, authentication configuration, payment merchant account, storage and secrets. This is **not** a shared multi-tenant SaaS. This document describes target behaviour, not a claim that every integration is complete.

## Product modules and acceptance criteria

1. Owner setup: configure verified restaurant name, logo, address, contact, timezone, hours, fulfilment zones, delivery fees, tax, policies and licensed imagery. No fictional fallback business data.
2. Customer menu: categories, item availability, prices, options, allergen disclosures, accurate images; owner can edit without developer intervention. Server validates current prices and availability when ordering.
3. Orders: customer cart, server-side order creation and idempotency, delivery/pickup, order status transitions, kitchen queue, owner notifications and customer tracking. No simulated success in live mode.
4. Reservations: owner-configured tables/capacity, hours, blackout dates, concurrency-safe availability, pending/confirmed/cancelled states and real notification delivery.
5. Payments: per-restaurant verified provider credentials; server-side intent/initiation, webhook signature and amount verification, idempotent settlement, refund/reconciliation flows, never trust client success or static account numbers.
6. Admin: owner/staff RBAC enforced on server; orders, reservations, menu, business settings and reporting. No customer access to administrative data.
7. Operations: deployment, migrations, backups, logs, incident recovery, privacy, accessibility and end-to-end testing.

## Isolation contract
- Each sale starts from a clean installation. No buyer inherits demo accounts, orders, customers, secrets or payment data.
- Independent database, storage, environment variables, domain and hosting project; no cross-installation API keys.
- Owner/admin accounts provisioned with secure invitations, no default passwords; revoke seller access at handover.
- Keep demo/staging isolated from production. Never flip production gates simply by changing a display label.

## Milestones
M1: inventory existing routes and server actions, remove misleading demo claims and define configuration/schema.
M2: implement persistence and server validation for menu, cart/order and role-protected admin.
M3: implement reservation inventory and concurrency-safe booking.
M4: integrate buyer-owned payment provider in sandbox with signed webhooks and reconciliation.
M5: email delivery, operational dashboard, acceptance tests, installation scripts and buyer documentation.
M6: pilot one buyer in staging, verify business data and production readiness, then deploy and hand over.

## Explicitly incomplete today
Current repository contains prototype/demo experiences and prelaunch blocks. A successful Vercel build is not proof of production-grade payments, reservations, secure administration or delivery. Do not sell these as operational until milestones pass.
