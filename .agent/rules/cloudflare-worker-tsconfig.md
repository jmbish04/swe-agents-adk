# Cloudflare Worker TypeScript Configuration

## Problem
Running `wrangler types` generates `worker-configuration.d.ts` with Cloudflare runtime types (`Request`, `Response`, `WebSocket`, etc.). Default TypeScript configurations include `lib.dom.d.ts`, which contains identical interfaces. Furthermore, recent versions of `@types/node` natively include `web-globals`. These combinations cause thousands of type collision errors (e.g., `Duplicate identifier 'DOMException'`).

## Solution: Required `tsconfig.json` Configuration

```jsonc
{
  "compilerOptions": {
    "skipLibCheck": true,
    "lib": ["ESNext"],
    "types": ["./worker-configuration.d.ts"]
  }
}
```

### If Using `nodejs_compat` Compatibility
If you have `nodejs_compat` enabled in your `wrangler.jsonc`, you **must** include the `@types/node` package:

```jsonc
{
  "compilerOptions": {
    "skipLibCheck": true, // Critical for preventing node web-globals collisions
    "lib": ["ESNext"],
    "types": ["./worker-configuration.d.ts", "node"]
  }
}
```

**Dependencies:**
Run `npm install -D @types/node` (or `pnpm add -D @types/node`)

---

## Mandatory Path Alias Maintenance
The `src/backend` directory utilizes strict path aliases to prevent messy relative pathing and circular dependencies.  

**You MUST maintain the `paths` object in `src/backend/tsconfig.json` so that all top-level directories in `src/backend` have a corresponding `@name/*` alias, AND a root `@/*` alias.**

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@agents/*": ["./agents/*"],
      "@ai/*": ["./ai/*"],
      "@api/*": ["./api/*"],
      "@db/*": ["./db/*"],
      "@health/*": ["./health/*"],
      "@logging/*": ["./logging/*"],
      "@routes/*": ["./routes/*"]
      // ⚠️ Add any new backend top-level directories here automatically.
    }
  }
}
```

---

## Common Error Patterns

| Error | Cause | Fix |
| :--- | :--- | :--- |
| `Duplicate identifier 'DOMException'` | `lib.dom.d.ts` or `node` types conflict with Cloudflare types | Remove `"DOM"` from `lib` array AND ensure `"skipLibCheck": true` is set |
| `Cannot find name 'Request'` | Missing generated types | Ensure `worker-configuration.d.ts` exists and is in `types` array |
| `Cannot find name 'WebSocket'` | Missing generated types | Ensure `worker-configuration.d.ts` exists and is in `types` array |
| `Module '"node"' not found` | Missing node types | Run `npm install -D @types/node` |


## Quick Reference: What to Check
- [ ] `lib` array does **NOT** include `"DOM"`
- [ ] `skipLibCheck` is set to `true`
- [ ] `types` array includes `"./worker-configuration.d.ts"`
- [ ] If `nodejs_compat` is enabled, `types` also includes `"node"`
- [ ] `@types/node` is installed as dev dependency
- [ ] **Path Aliases:** The `paths` array contains an up-to-date alias mapping for EVERY root folder in `src/backend` (e.g. `@db/*`, `@api/*`).

Severity: **Critical** - Blocks compilation and IDE functionality.
Affected Versions: All Cloudflare Workers projects using TypeScript with `wrangler types` and `@types/node`.
