# Authentication deployment checklist — Invalid origin

The Better Auth server checks the browser Origin on credentialed POST requests. This installation trusts its configured BETTER_AUTH_URL plus the exact Vercel-generated VERCEL_URL, VERCEL_BRANCH_URL and VERCEL_PROJECT_PRODUCTION_URL (when present). It intentionally does not trust all *.vercel.app origins.

For each restaurant deployment:
1. Set BETTER_AUTH_URL to the exact canonical public URL including https:// (no trailing path). For a custom domain, use https://restaurant.example.
2. Set a unique, strong BETTER_AUTH_SECRET and that restaurant's own DATABASE_URL; migrate schema before launch.
3. Confirm the actual URL in the browser is among the configured origins. If a manually assigned alias is used, explicitly add it via a reviewed allowlist change rather than allowing unrelated hosts.
4. Deploy, test signup/signin from the canonical URL and preview URL, check browser network response for /api/auth/sign-up/email. Never turn off CSRF/origin checking as a workaround.
5. For password recovery configure RESEND_API_KEY and DREAMTABLE_EMAIL_FROM with a sender domain verified in Resend. Without these, /forgot-password cannot deliver emails. Do not claim a reset was sent if provider delivery fails.
6. Use distinct credentials, database and sender for every buyer installation; test recovery end to end. Never ask the owner for their existing password.

Existing users should recover through /forgot-password after sender setup, not be re-created with a known/shared password.
