# Type Safety & Env Management
1. NEVER modify `worker-configuration.d.ts` directly. Run `npx wrangler types` when `wrangler.jsonc` changes.
2. The generated `worker-configuration.d.ts` is the SINGLE SOURCE OF TRUTH for the `Env` type.
3. NEVER redefine or manually type the `Env` interface.
4. NEVER import `Env` from any file.
