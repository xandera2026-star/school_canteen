# XAndera School Canteen Platform – MVP Architecture

## Objectives
- Deliver a production-grade multi-tenant ordering platform for multiple schools.
- Support Android/iOS parent app, React admin portal, and NestJS backend deployed on Render.
- Preserve extensibility for premium features (dedicated owner dashboards, advanced billing, analytics).

## User Channels
- **Parent Mobile App (Flutter)**: Android + iOS parity, offline cache, ordering, payments, notifications.
- **Admin / Canteen Web Portal (React + Vite + Tailwind)**: Student management, menus, orders, reports, theming.
- **School Owner + Platform Owner views**: Hosted inside the React portal for now (separate routes + RBAC).

## Services (Render Deployments)
1. **Backend API (NestJS, PostgreSQL driver, Firebase Admin, optional Redis)**
   - Auth (OTP via Firebase/custom, JWT + refresh, role assignment).
   - Multi-tenant data enforcement (school_id scoping + RLS validation).
   - Domains: schools, subscriptions, students, parents, menu categories/items, orders, payments, allergies, announcements, audit logs, idempotency.
   - Notification dispatch (FCM) and synchronous job handling (cut-off validation, receipts).
   - REST endpoints as defined in the OpenAPI spec (coming deliverable).

2. **Admin Web (React + TS + Vite + Tailwind)**
   - Serves School Admin, Canteen Manager, School Owner, Platform Owner experiences.
   - Uses backend REST + Firebase Storage uploads.
   - Per-school theming (logo/color/cut-off settings).

3. **Flutter Mobile App (Android & iOS builds)**
   - Not deployed on Render; delivered via Play Store/TestFlight later.
   - Uses backend REST + Firebase for push/storage; caches children + menus offline.
   - Payment via Google Pay deep links and Cash-on-Delivery flag.

4. **PostgreSQL (Render managed DB)**
   - Hosts all tenant data with RLS policies for parents, admins, owners, platform staff.
   - Includes auditing tables, idempotency keys, versioned menu items, payment/order records.

## Key Cross-Cutting Concerns
- **Multi-Tenancy**: Every table carries `school_id`, `created_at/by`, `updated_at/by`. RLS ensures least privilege access.
- **Idempotency**: Supported via `idempotency_keys` table + middleware for all order/payment endpoints.
- **Allergy & Preferences**: Stored per student; menu queries filter out risky items, and ordering API enforces warnings.
- **Announcements**: Daily school-level messages accessible in parent app + admin portal.
- **Audit Logging**: Unified table capturing who/what/when/old/new; emitted from backend interceptors.
- **Backups & Monitoring**: Render PostgreSQL backups + optional cron job (parked for now) + logging via platform owner dashboards.

## External Integrations
- **Firebase**: OTP (phone auth), Cloud Messaging, Storage for media uploads.
- **Google Pay**: UPI deep links for parent payments.
- **Future Hooks**: Attendance APIs, Stripe-like payment gateway, iOS premium support, error monitoring (e.g., Sentry).

## Deployment + CI/CD
- Backend + admin UI deployed to Render services described in `render.yaml` (forthcoming).
- GitHub Actions pipeline to lint/test backend, build Flutter & admin artifacts, and deploy backend/admin to Render.

## Roadmap Hooks
- Optional worker service or cron jobs for heavy async workloads once traffic grows.
- Billing microservice when subscription management needs automation.
- Enhanced analytics dashboards for platform owners once data volume warrants pre-aggregation.
