#!/bin/bash
echo "Installing .agent/rules..."

mkdir -p .agent/rules

cat << 'EOF' > .agent/rules/01-type-safety.md
# Type Safety & Env Management
1. NEVER modify `worker-configuration.d.ts` directly. Run `npx wrangler types` when `wrangler.jsonc` changes.
2. The generated `worker-configuration.d.ts` is the SINGLE SOURCE OF TRUTH for the `Env` type.
3. NEVER redefine or manually type the `Env` interface.
4. NEVER import `Env` from any file.
EOF

cat << 'EOF' > .agent/rules/02-imports.md
# Import Paths
1. EVERY module import MUST use TypeScript path aliases defined in `tsconfig.json`.
2. Do not use relative paths (e.g., `../../db/schema`). 
3. Use `@db/`, `@api/`, `@agents/`, `@frontend/`, etc.
EOF

cat << 'EOF' > .agent/rules/03-database-and-api.md
# Database & API
1. Use Drizzle ORM with D1 (SQLite dialect).
2. One schema file per table in `src/backend/db/schemas/`.
3. Use `drizzle-zod` to infer Zod schemas directly from Drizzle tables.
4. Use Hono with `@hono/zod-openapi` for REST routes.
5. All secrets must use the Secrets Store binding, never hardcoded.
EOF

echo ".agent/rules installed successfully."