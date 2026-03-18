// src/backend/index.ts

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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("MindHive Backend Running");
  },
};
