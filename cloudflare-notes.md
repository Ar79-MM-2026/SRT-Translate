# Cloudflare Route Repair Notes

Cloudflare Pages Functions are discovered from a root-level `/functions` directory and route requests on the Pages deployment. Official references: [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/), [Functions get started](https://developers.cloudflare.com/pages/functions/get-started/), and [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).

Cloudflare Workers AI bindings for Pages Functions are configured through the Cloudflare dashboard, according to [Workers AI bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/) and [Pages Functions Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/). A local `wrangler.toml` alone may not create the binding for a Pages project.

The user’s response body begins with `<!DOCTYPE html>`, which indicates the request is being handled by the SPA/static fallback instead of the Pages Function. The practical fix is to deploy from the repository root with the `functions/` directory included, use the correct Pages output directory, and configure the Workers AI binding named `AI` in the Cloudflare Pages dashboard.
