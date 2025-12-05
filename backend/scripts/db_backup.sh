#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

if [[ -z "${BACKUP_BUCKET_URL:-}" ]]; then
  echo "BACKUP_BUCKET_URL is required" >&2
  exit 1
fi

if [[ -z "${BACKUP_AUTH_HEADER:-}" ]]; then
  echo "BACKUP_AUTH_HEADER is required (for signed PUT uploads)" >&2
  exit 1
fi

STAMP="$(date -u +"%Y%m%d-%H%M%S")"
TMP_FILE="/tmp/xandera-db-${STAMP}.sql.gz"

# Generate compressed dump
pg_dump --no-owner --no-privileges "$DATABASE_URL" | gzip > "$TMP_FILE"

# Upload to object storage / backup bucket using pre-configured auth header
curl -X PUT \
  -H "Authorization: ${BACKUP_AUTH_HEADER}" \
  -H "Content-Type: application/gzip" \
  --upload-file "$TMP_FILE" \
  "${BACKUP_BUCKET_URL}/xandera-db-${STAMP}.sql.gz"

rm "$TMP_FILE"

echo "Backup completed for ${STAMP}"