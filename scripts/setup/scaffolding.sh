#!/bin/bash
echo "Scaffolding MindHive File Structure..."

# ==========================================
# FRONTEND SCAFFOLDING
# ==========================================
mkdir -p src/frontend/pages/auth
mkdir -p src/frontend/pages/landing-saas
mkdir -p src/frontend/pages/dashboard
mkdir -p src/frontend/pages/applications
mkdir -p src/frontend/pages/application-viewport/landing
mkdir -p src/frontend/pages/application-viewport/projects
mkdir -p src/frontend/pages/project-viewport/insights
mkdir -p src/frontend/pages/project-viewport/backlog
mkdir -p src/frontend/pages/project-viewport/parking-lot
mkdir -p src/frontend/pages/project-viewport/kanban
mkdir -p src/frontend/pages/project-viewport/realtime-progress
mkdir -p src/frontend/pages/project-viewport/chatroom/agent
mkdir -p src/frontend/pages/project-viewport/chatroom/phase

# touch src/frontend/astro.config.mjs
touch src/frontend/sidebar-nav.tsx

# ==========================================
# BACKEND SCAFFOLDING
# ==========================================
mkdir -p src/backend

# # 1. Wrangler.jsonc
# cat << 'EOF' > src/backend/wrangler.jsonc
# {
#   "$schema": "./node_modules/wrangler/config-schema.json",
#   "name": "mindhive",
#   "main": "src/backend/index.ts",
#   "compatibility_date": "2026-03-17",
#   "compatibility_flags": ["nodejs_compat"],
#   "assets": {
#     "directory": "../frontend/dist",
#     "binding": "ASSETS",
#     "not_found_handling": "single-page-application"
#   },
#   "d1_databases": [
#     {
#       "binding": "DB",
#       "database_name": "mindhive-db",
#       "database_id": "REPLACE_ME",
#       "migrations_dir": "./drizzle"
#     }
#   ],
#   "ai": { "binding": "AI" },
#   "durable_objects": {
#     "bindings": [
#       { "name": "PM_AGENT", "class_name": "ProductManagerAgent" },
#       { "name": "UX_AGENT", "class_name": "UxTeamAgent" },
#       { "name": "PYTHON_AGENT", "class_name": "PythonTeamAgent" },
#       { "name": "APPS_AGENT", "class_name": "AppsScriptTeamAgent" },
#       { "name": "WORKSPACE_AGENT", "class_name": "WorkspaceTeamAgent" },
#       { "name": "CF_AGENT", "class_name": "CloudflareTeamAgent" },
#       { "name": "GITHUB_AGENT", "class_name": "GithubTeamAgent" },
#       { "name": "SPECIALTY_AGENT", "class_name": "SpecialtyTeamAgent" }
#     ]
#   },
#   "migrations": [
#     {
#       "tag": "v1",
#       "new_sqlite_classes": [
#         "ProductManagerAgent", "UxTeamAgent", "PythonTeamAgent", 
#         "AppsScriptTeamAgent", "WorkspaceTeamAgent", "CloudflareTeamAgent",
#         "GithubTeamAgent", "SpecialtyTeamAgent"
#       ]
#     }
#   ]
# }
# EOF

# 2. Agents
for team in _shared cloudflare python appsscript google github specialty; do
  mkdir -p src/backend/agents/$team
  touch src/backend/agents/$team/index.ts
  touch src/backend/agents/$team/health.ts
done

mkdir -p src/backend/agents/_shared/tools
touch src/backend/agents/_shared/tools/index.ts
touch src/backend/agents/_shared/tools/health.ts

# 3. AI
mkdir -p src/backend/ai/providers
mkdir -p src/backend/ai/utils
touch src/backend/ai/index.ts
touch src/backend/ai/health.ts

# 4. API (REST, WS, MCP)
for protocol in websocket rest mcp; do
  mkdir -p src/backend/api/$protocol/endpoints
  touch src/backend/api/$protocol/index.ts
  touch src/backend/api/$protocol/health.ts
done
touch src/backend/api/index.ts

# 5. Routes
for route_type in frontend rest_api websocket_api mcp; do
  mkdir -p src/backend/routes/$route_type/handlers
  touch src/backend/routes/$route_type/index.ts
  touch src/backend/routes/$route_type/health.ts
done
touch src/backend/routes/index.ts

# 6. Database
mkdir -p src/backend/db/schemas/core
touch src/backend/db/index.ts

# 7. Health & Logging
mkdir -p src/backend/health
touch src/backend/health/index.ts
touch src/backend/health/db.ts

mkdir -p src/backend/logging
touch src/backend/logging/index.ts
touch src/backend/logging/db.ts
touch src/backend/logging/console.ts

echo "File structure scaffolded successfully!"
echo "Note: To finalize frontend, run 'pnpm create astro' inside src/frontend and then 'npx shadcn@latest init -y'."