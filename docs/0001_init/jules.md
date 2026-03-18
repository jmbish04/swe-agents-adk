# MindHive Initialization - Jules Handoff

Welcome to the MindHive project, Jules! 

You are stepping in as the execution engine for the initial scaffolding and infrastructure deployment. 

## Your Directives
1. **Strictly Follow `project_tasks.json`**: You must execute the epics, stories, and steps exactly as defined in `docs/0001_init/project_tasks.json`.
2. **Read the Rules**: Before touching any code, review `docs/0001_init/PRD.md` and `.agent/AGENTS.md` (or any workspace rules provided to you) for critical technical constraints (e.g., "NEVER use Vercel AI SDK", "DEFAULT DARK THEME SHADCN").
3. **Pnpm Only**: Always use `pnpm` for package management.
4. **Validation**: You must run the exact `validationCommand` specified in each step. Do NOT mark a step as `complete` unless its `successCriteria` are fully satisfied.
5. **State Tracking**: Keep `project_tasks.json` updated. Change the `status` of steps, stories, and epics to `in_progress` when you start them, and `complete` when you finish them and pass validation.

## Your Goal for this Run
Execute Epic 1 entirely. If you have cycles left, move on to Epic 2. 

Remember, you are to refer heavily to the Cloudflare Docs MCP using the `cloudflareDocsQueries` provided in `project_tasks.json` to ensure you build Durable Objects and Hono bindings to the exact specifications of the Cloudflare Workers 2026 platform.
