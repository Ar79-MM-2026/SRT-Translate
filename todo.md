# Manus Translation Migration

- [x] Upgrade the project with the server-side capability required for secure Manus LLM calls.
- [x] Keep translation stateless and database-free; the server stores no subtitle files or translation history.
- [x] Implement a `/api/translate` server route using the Manus model and protected technical terms.
- [x] Preserve the existing client SRT parser, neighboring context, timestamps, and cue numbers.
- [x] Run checks and validate the migrated endpoint with TypeScript, Vitest, build, and a live Burmese request.
- [ ] Save a checkpoint and update the GitHub deployment path.
