# The DreamTable — Deployment Notes

## Vercel

1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Vercel will use `npm install --no-audit --no-fund` and `npm run build`.
4. No database is required for the current demo build.

## Current scope

This version is a polished interactive restaurant demo. Cart, reservations, orders,
loyalty and admin state are stored in the visitor's browser via localStorage. Card
checkout is UI-only and does not charge a real card. Do not use it as a live payment
or restaurant operations system until a real backend/database and payment provider
are connected.

Authentication is intentionally disabled in the shipped demo configuration.
The `/admin` area is therefore not a secure production admin panel.

## Branding / social preview

`src/lib/og/site.json` is set to DreamTable and `public/og.jpg` is included. The
prebuilt `.vercel/output` from Grok was intentionally removed so Vercel creates a
fresh build from the current source instead of deploying stale generated output.
