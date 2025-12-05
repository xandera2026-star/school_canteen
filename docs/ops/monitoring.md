# Observability & Monitoring

## Backend
- **Sentry**: configure `SENTRY_DSN` on the backend service. Add NestJS interceptor to capture exceptions and slow requests. Alerts route to ops@xandera.com.
- **Render health checks**: backend already exposes `/health`. Set Render service auto-restart if healthcheck fails for 3 consecutive minutes.
- **Structured logging**: backend logs JSON to stdout. Attach Render log drains (Datadog or Logtail) for long term retention.

## Database & Backups
- Render Postgres automatic snapshots cover 7 days. The cron job `xandera-db-backup` (see `infrastructure/render.yaml`) runs `backend/scripts/db_backup.sh` nightly (01:00 UTC) and uploads a gzip dump to object storage referenced by `BACKUP_BUCKET_URL` + `BACKUP_AUTH_HEADER`.
- Recommended bucket: Cloudflare R2 or AWS S3 with lifecycle rules (30-day retention + monthly archives).
- Periodically test restores in staging.

## Mobile & Admin
- **Firebase Crashlytics / Analytics**: integrate into Flutter project before production build to capture crashes and user journeys.
- **Admin UI**: ship source maps and enable Sentry browser SDK for major routes. Env var `VITE_SENTRY_DSN` can be added once ready.

## Alerting
- Render incident webhooks -> PagerDuty/Slack `#ops-alerts`.
- Database backup cron publishes log line `Backup completed`. Add Render log alerts that trigger if string missing for >26h.
- Monitor SMS/OTP provider (Firebase) via daily success rate metrics. Collect from backend logs into Datadog or Chronosphere.
