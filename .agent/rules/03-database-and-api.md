# Database & API
1. Use Drizzle ORM with D1 (SQLite dialect).
2. One schema file per table in `src/backend/db/schemas/`.
3. Use `drizzle-zod` to infer Zod schemas directly from Drizzle tables.
4. Use Hono with `@hono/zod-openapi` for REST routes.
5. All secrets must use the Secrets Store binding, never hardcoded.
