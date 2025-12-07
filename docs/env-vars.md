# Environment Variables

## Backend (NestJS)
| Variable | Description |
| --- | --- |
| NODE_ENV | `production` / `staging` / `development` |
| PORT | HTTP port, default 3000 |
| DATABASE_URL | Render Postgres connection string |
| REDIS_URL | Optional cache for sessions/idempotency |
| JWT_SECRET | Signing key for access tokens |
| JWT_EXPIRY | Access token TTL (e.g., `3600s`) |
| REFRESH_SECRET | Refresh token signing secret |
| REFRESH_EXPIRY | Refresh TTL (e.g., `30d`) |
| FIREBASE_ADMIN_CREDENTIALS | Base64 JSON credentials for Firebase Admin SDK |
| FCM_SERVER_KEY | For sending push notifications |
| GCP_PROJECT_ID | Firebase project reference |
| IDP_SALT | Salt for idempotency hashing |
| GOOGLE_PAY_DEEP_LINK | Base URL template for UPI deep links |
| AUDIT_TOPIC | Optional pub/sub topic for audit fanout |
| RENDER_EXTERNAL_URL | Provided by Render for health checks |
| SENTRY_DSN | Backend error monitoring (Sentry) |
| BACKUP_BUCKET_URL | Object storage endpoint for DB dumps |
| BACKUP_AUTH_HEADER | Auth header/token for uploading backups |
| CORS_ORIGINS | Comma-separated list of allowed frontend origins |

## Admin Web (React + Vite)
| Variable | Description |
| --- | --- |
| VITE_API_BASE_URL | Backend API base path |
| VITE_FIREBASE_CONFIG | JSON string used by Firebase JS SDK |
| VITE_BUILD_ENV | `staging` / `production` |
| VITE_ENABLE_IOS_SUPPORT | Toggles iOS-specific messaging |
| VITE_SENTRY_DSN | Frontend error monitoring |
| VITE_DEMO_SCHOOL_CODE | Optional short code to prefill login |

## Parent Web (React + Vite)
| Variable | Description |
| --- | --- |
| VITE_API_BASE_URL | Backend API base path |
| VITE_DEMO_SCHOOL_CODE | Optional short code hint for demo logins |

## Mobile (Flutter)
| Variable | Description |
| --- | --- |
| API_BASE_URL | Backend REST endpoint |
| FIREBASE_ANDROID_GOOGLE_SERVICES | Injected google-services.json |
| FIREBASE_IOS_GOOGLE_SERVICES | ios/GoogleService-Info.plist |
| FCM_VAPID_KEY | For web push / optional |
| SENTRY_DSN | Crash/error reporting |
| OFFLINE_CACHE_TTL | Minutes to keep cached menus/students |

## Firebase Project Secrets
| Variable | Description |
| --- | --- |
| FIREBASE_API_KEY | From Firebase console |
| FIREBASE_AUTH_DOMAIN | Auth domain |
| FIREBASE_PROJECT_ID | Shared with backend |
| FIREBASE_STORAGE_BUCKET | For menu images/student photos |
| FIREBASE_MESSAGING_SENDER_ID | For FCM |
| FIREBASE_APP_ID | For app registration |
| FIREBASE_MEASUREMENT_ID | Optional analytics |

## Render Service Secrets
| Variable | Description |
| --- | --- |
| RENDER_API_KEY | Used in CI deploy steps |
| RENDER_BACKEND_SERVICE_ID | Service identifier for backend |
| RENDER_ADMIN_SERVICE_ID | Service identifier for admin static site |
| RENDER_PARENT_SERVICE_ID | Service identifier for parent web portal |
| RENDER_POSTGRES_DATABASE_URL | Provided automatically to services |
