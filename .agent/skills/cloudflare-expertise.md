# Cloudflare Expertise
- **Workers**: High-performance V8 isolates. Uses Hono for routing.
- **Durable Objects**: Stateful SQLite-backed entities used for Agent RPC and WebSocket PubSub.
- **D1**: Serverless SQLite. Accessed via Drizzle ORM.
- **AI Gateway**: Central router for all LLM calls to manage caching, logging, and rate limits.
- **Assets**: Hosts Astro frontend directly from the Worker.
