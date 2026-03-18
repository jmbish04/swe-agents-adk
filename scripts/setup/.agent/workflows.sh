#!/bin/bash
echo "Installing .agent/workflows..."

mkdir -p .agent/workflows

cat << 'EOF' > .agent/workflows/01-project-intake.md
# Project Intake Workflow
1. **Product Manager Agent** receives natural language prompt.
2. Generates `app_id` and saves to `applications` table.
3. Scopes epics and user stories, saving them to `project_tasks` table.
4. Dispatches tasks via RPC to the relevant specialized agents.
5. Updates the shared WebSocket pub/sub channel.
EOF

cat << 'EOF' > .agent/workflows/02-ux-retrofit.md
# UX Retrofit Workflow
1. **UX Agent** reviews existing backend API outputs or `stitch-sdk` mockups.
2. Uses `jules-sdk` to plan a total rewrite using Astro and React `shadcn` components.
3. Enforces **Default Dark Theme** strictly.
4. **Cloudflare Agent** reviews output to ensure Worker Assets compatibility.
EOF

cat << 'EOF' > .agent/workflows/03-workspace-automation.md
# Workspace Automation Workflow
1. **Workspace Agent** checks `project_tasks` for documentation requirements.
2. Exports project plans to Google Docs/Sheets using Workspace APIs.
3. Indexes relevant Gmail communications into Vectorize for RAG.
4. Writes status updates back to D1.
EOF

echo ".agent/workflows installed successfully."