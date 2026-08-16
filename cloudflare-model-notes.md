# Cloudflare Workers AI model verification

Cloudflare's current model documentation lists `@cf/meta/llama-3.1-8b-instruct-fast` as a supported fast instruction-tuned multilingual model. Its official usage example accepts `messages` and returns a synchronous `response` string. Source: https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/

Cloudflare also lists `@cf/meta/llama-3.2-3b-instruct` as a supported instruction-tuned multilingual model with an 80,000-token context window. Its official usage example accepts `messages` and returns a synchronous `response` string. Source: https://developers.cloudflare.com/workers-ai/models/llama-3.2-3b-instruct/

The Workers AI catalog was updated Aug 12, 2026 and should be checked when model deprecations occur: https://developers.cloudflare.com/workers-ai/models/

Chosen replacement: `@cf/meta/llama-3.1-8b-instruct-fast`, because it preserves the existing messages-based request and is explicitly documented as the fast version of the multilingual instruction-tuned model.
