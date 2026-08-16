# Cloudflare `/api/translate` Route Repair

- [x] Inspect the current Cloudflare Pages build/output assumptions and function placement.
- [x] Ensure the deployed Pages project includes the `functions/api/translate` route rather than only `dist/public` static assets.
- [x] Add a production-safe endpoint configuration and a clear fallback error for SPA HTML responses.
- [x] Validate the build and route wiring locally where possible, then document the exact Cloudflare Pages settings.
- [x] Save a new checkpoint after the route fix.
