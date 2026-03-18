# Coding Agent Instructions: MindHive Execution

## MANDATORY STANDARDS — READ BEFORE ANY WORK

### 1. Type Safety & Env Management
- ALWAYS run `npx wrangler types` after ANY change to `wrangler.jsonc` (new bindings, vars, secrets, etc.).
- The generated `worker-configuration.d.ts` is the SINGLE SOURCE OF TRUTH for the `Env` type.
- NEVER redefine, extend, or manually type the `Env` interface anywhere in the codebase.
- NEVER import `Env` from any file.
- MindHive has 7 Durable Object classes. They MUST all be registered correctly in the environment types.

### 2. Import Paths
- EVERY module import MUST use TypeScript path aliases defined in `tsconfig.json`.
- ✅ CORRECT: `import { projects } from '@db/schemas/projects'`
- ❌ WRONG: `import { projects } from '../../db/schemas/projects'`

### 3. Agent & AI Specifics (CRITICAL)
- **NEVER use Vercel AI SDK (`ai`, `ai/react`, `useChat`).**
- MindHive relies entirely on `@cloudflare/ai-chat` and the native Cloudflare `agents` SDK package.
- The `ProductManagerAgent` MUST extend `AIChatAgent<Env>`.
- The peripheral workflow agents (`UxTeamAgent`, `PythonTeamAgent`, `WorkspaceTeamAgent`, etc.) MUST extend `Agent<Env>`.
- Cross-DO communication must utilize DO RPC.
- The `MindHiveMcpServer` MUST extend `McpAgent<Env>`.
- All LLM interactions route through AI Gateway: `env.AI.gateway(env.AI_GATEWAY_NAME).run(...)`.

### 4. Database
- Use **Drizzle ORM** with **D1**.
- SQLite dialect only. Do not use Postgres specific functions.
- Run `pnpm run db:generate` to verify schema changes.

### 5. Frontend & UI
- **DEFAULT DARK THEME SHADCN — no exceptions**. `<html class="dark">` is mandatory in Astro layouts.
- You must build all 5 requested pages (`/`, `/docs`, `/health`, `/chat`, `/projects/:id`).
- For chat, use `@assistant-ui/react` and wrap the `useAgentChat` hook appropriately.

### 6. Package Manager
- ALWAYS use `pnpm`. No `npm i`, no `yarn add`.
- ALWAYS run `pnpm add -D wrangler@latest` before starting.

### 7. Task Processing
- Read `project_tasks.json`. Follow tasks in exact sequence.
- Run the required `cloudflare_docs_queries` via your NotebookLM/Docs integration tool BEFORE coding. Do not guess API shapes for DO RPC or MCP Agents.
- Update the `status` field in `project_tasks.json` as you work (`started` -> `scaffold_complete` -> `complete`).

### CRITICAL: Environment Types (`Env`)
1. **Never modify `worker-configuration.d.ts` directly.** - ALWAYS run `npx wrangler types` (or `pnpm run types`) whenever `wrangler.jsonc` is updated. 
   - This command generates the exact bindings (D1, DOs, AI Gateway, Assets) automatically.
2. **Never redefine `Env`.** - Do not write `interface Env { ... }` anywhere in your code. It is globally defined by the generated declaration file.
3. **Never import `Env`.**
   - Because it is included in `tsconfig.json`'s `types` array, `Env` is a global type. 
   - ❌ WRONG: `import { Env } from '../../worker-configuration';`
   - ✅ CORRECT: `const app = new OpenAPIHono<{ Bindings: Env }>();`
4. **TypeScript Compatibility (`tsconfig.json`)**:
   - The Cloudflare `worker-configuration.d.ts` includes runtime types that natively conflict with TypeScript's built-in `lib.dom.d.ts`.
   - Your `tsconfig.json` MUST explicitly declare `"lib": ["ESNext"]` (omitting `dom`) to prevent thousands of type collision errors (like `Request`, `Response`, `WebSocket`, etc).
   - If using the `nodejs_compat` flag in `wrangler.jsonc`, you MUST also install `@types/node` and add `"node"` alongside `"./worker-configuration.d.ts"` in the `types` array.

### CRITICAL: Import Paths
1. **Never use relative paths for internal modules.**
   - The codebase utilizes strict `tsconfig.json` path aliases to prevent messy refactoring and circular dependency issues.
   - ❌ WRONG: `import { projects } from '../../../db/schemas/projects'`
   - ✅ CORRECT: `import { projects } from '@db/schemas/projects'`
2. **Apply this to both Frontend and Backend.** - If writing a React island in the frontend, use `@frontend/components/...`. 
   - If writing a Hono route, use `@db/...` or `@api/...`.
