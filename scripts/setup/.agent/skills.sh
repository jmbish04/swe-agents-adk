#!/bin/bash
echo "Installing .agent/skills..."

mkdir -p .agent/skills

cat << 'EOF' > .agent/skills/cloudflare-expertise.md
# Cloudflare Expertise
- **Workers**: High-performance V8 isolates. Uses Hono for routing.
- **Durable Objects**: Stateful SQLite-backed entities used for Agent RPC and WebSocket PubSub.
- **D1**: Serverless SQLite. Accessed via Drizzle ORM.
- **AI Gateway**: Central router for all LLM calls to manage caching, logging, and rate limits.
- **Assets**: Hosts Astro frontend directly from the Worker.
EOF

cat << 'EOF' > .agent/skills/frontend-expertise.md
# Astro & Shadcn Expertise
- Build interactive UIs using Astro with React islands (`client:load`).
- Shadcn UI components must be initialized with CSS variables and default dark theme.
- Navigation relies on client-side state for real-time WebSocket dashboarding.
EOF

cat << 'EOF' > .agent/skills/python-cli-expertise.md
# Python & CLI Expertise
- Build isolated CLI tools for data ingestion.
- Interface with Cloudflare Vectorize and AI Gateway via REST.
- Build internal RAG pipelines and NotebookLM integrations.
EOF

echo ".agent/skills installed successfully."