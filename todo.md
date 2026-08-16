# Cloudflare Pages Build Fix

- [ ] Rename the local request context string so it does not shadow the `onRequestPost(context)` handler parameter.
- [ ] Run TypeScript and production build checks, including Pages Functions bundling where possible.
- [ ] Push the corrected function to GitHub and confirm the new commit.
- [ ] Report the redeploy step and remaining non-blocking warnings.
