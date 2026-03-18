// src/backend/index.ts

import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import healthRoute from '@api/rest/health';
import { ProductManagerAgent } from "@ai/agents/ProductManagerAgent";
import {
  UxTeamAgent,
  PythonTeamAgent,
  AppsScriptTeamAgent,
  WorkspaceTeamAgent,
  CloudflareTeamAgent,
  GithubTeamAgent,
  SpecialtyTeamAgent
} from "@ai/agents/Agents";

const app = new OpenAPIHono<{ Bindings: Env }>();

// 1. REST API & Swagger
app.route('/api/health', healthRoute);
app.doc31('/openapi.json', { openapi: '3.1.0', info: { title: 'MindHive API', version: '1.0.0' } });
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));

export {
  ProductManagerAgent,
  UxTeamAgent,
  PythonTeamAgent,
  AppsScriptTeamAgent,
  WorkspaceTeamAgent,
  CloudflareTeamAgent,
  GithubTeamAgent,
  SpecialtyTeamAgent
};

export default app;
