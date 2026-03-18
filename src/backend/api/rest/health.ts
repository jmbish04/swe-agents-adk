import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { checkHealth } from '@health/index';

const route = new OpenAPIHono<{ Bindings: Env }>();

const healthCheckRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Health'],
  summary: 'Check system health',
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({
        timestamp: z.string(),
        services: z.object({
          db: z.object({ status: z.string(), details: z.any().optional(), error: z.string().optional() }),
          ai: z.object({ status: z.string(), details: z.any().optional(), error: z.string().optional() }),
          agents: z.array(z.object({ name: z.string(), status: z.string() })),
        }),
        overallStatus: z.string(),
      }) } },
      description: 'System health report',
    },
  },
});

route.openapi(healthCheckRoute, async (c) => {
  try {
    const healthReport = await checkHealth(c.env);
    return c.json(healthReport, 200);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return c.json({ error: errorMessage }, 500);
  }
});

export default route;
