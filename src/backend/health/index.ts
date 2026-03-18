import { checkDbHealth } from './db';

interface ServiceHealth {
  status: 'healthy' | 'unhealthy';
  details?: unknown;
  error?: string;
}

export async function checkHealth(env: Env) {
  let dbHealth: ServiceHealth = { status: 'unhealthy', error: 'DB binding not available' };
  try {
    if (env.DB) {
      dbHealth = await checkDbHealth(env.DB);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown DB health check error';
    dbHealth = { status: 'unhealthy', error: message };
  }

  // Check AI Gateway
  let aiHealth: ServiceHealth = { status: 'unhealthy', details: 'not tested' };
  try {
    if (env.AI && typeof env.AI.run === 'function') {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [{ role: 'user', content: 'Say healthy' }],
        max_tokens: 10,
      });
      aiHealth = { status: 'healthy', details: aiResponse };
    } else {
      aiHealth = { status: 'unhealthy', error: 'AI binding not available or misconfigured' };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI health check error';
    aiHealth = { status: 'unhealthy', error: message };
  }

  // Check Agent Durable Objects (Stubs only for now)
  const agentNames = [
    'PM_AGENT', 'UX_AGENT', 'PYTHON_AGENT', 'APPS_AGENT',
    'WORKSPACE_AGENT', 'CF_AGENT', 'GITHUB_AGENT', 'SPECIALTY_AGENT'
  ] as const;

  const agentHealths = agentNames.map(name => ({
    name,
    status: env[name] ? 'healthy' : 'unhealthy',
  }));

  const allAgentsHealthy = agentHealths.every(agent => agent.status === 'healthy');

  return {
    timestamp: new Date().toISOString(),
    services: {
      db: dbHealth,
      ai: aiHealth,
      agents: agentHealths,
    },
    overallStatus: (dbHealth.status === 'healthy' && aiHealth.status === 'healthy' && allAgentsHealthy) ? 'healthy' : 'degraded',
  };
}
