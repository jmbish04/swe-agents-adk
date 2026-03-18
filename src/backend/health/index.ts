import { checkDbHealth } from './db';

export async function checkHealth(env: any) {
  let dbHealth: any = { status: 'unhealthy', error: 'DB binding not available' };
  try {
    if (env && env.DB) {
      dbHealth = await checkDbHealth(env.DB);
    }
  } catch (e: any) {
    dbHealth = { status: 'unhealthy', error: e.message };
  }

  // Check AI Gateway
  let aiHealth: any = { status: 'unhealthy', details: 'not tested' };
  try {
    if (env && env.AI && typeof env.AI.run === 'function') {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [{ role: 'user', content: 'Say healthy' }],
        max_tokens: 10,
      });
      aiHealth = { status: 'healthy', details: aiResponse };
    } else {
      aiHealth = { status: 'unhealthy', error: 'AI binding not available or misconfigured' };
    }
  } catch (error: any) {
    aiHealth = { status: 'unhealthy', error: error.message };
  }

  // Check Agent Durable Objects (Stubs only for now)
  const agentNames = [
    'PM_AGENT', 'UX_AGENT', 'PYTHON_AGENT', 'APPS_AGENT',
    'WORKSPACE_AGENT', 'CF_AGENT', 'GITHUB_AGENT', 'SPECIALTY_AGENT'
  ];

  const agentHealths = agentNames.map(name => ({
    name: name,
    status: (env && env[name]) ? 'healthy' : 'unhealthy',
  }));

  return {
    timestamp: new Date().toISOString(),
    services: {
      db: dbHealth,
      ai: aiHealth,
      agents: agentHealths,
    },
    overallStatus: (dbHealth.status === 'healthy' && aiHealth.status === 'healthy') ? 'healthy' : 'degraded',
  };
}
