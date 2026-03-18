// src/backend/api/index.ts

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { apiReference } from '@scalar/hono-api-reference';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schemas/project_tasks';


const app = new OpenAPIHono<{ Bindings: Env }>();

// ============================================================================
// Zod Validation Schemas (Strict matching to project_tasks.json)
// ============================================================================

const StepSchema = z.object({
  number: z.number().openapi({ example: 1.1 }),
  title: z.string().openapi({ example: 'Update wrangler.jsonc' }),
  status: z.string().default('not_started').openapi({ example: 'not_started' }),
  technical_requirements: z.array(z.string()).optional(),
  success_criteria: z.array(z.string()).optional(),
});

const TaskSchema = z.object({
  task_number: z.number().openapi({ example: 1 }),
  status: z.string().default('not_started').openapi({ example: 'not_started' }),
  agent_assigned: z.string().openapi({ example: 'Core_Scaffold_Agent' }),
  task_title: z.string().openapi({ example: 'Setup Wrangler and Types' }),
  task_description: z.string().openapi({ example: 'Configure bindings and generate types.' }),
  task_dependencies: z.array(z.string()).optional(),
  cloudflare_docs_queries: z.array(z.string()).optional(),
  steps: z.array(StepSchema),
  requirements: z.array(z.string()).optional(),
  success_criteria: z.array(z.string()).optional(),
});

const ImplementationPlanSchema = z.object({
  title: z.string(),
  description: z.string(),
  architecture: z.object({
    explanation: z.string(),
    mermaid_diagram: z.string(),
  }),
  proposed_changes: z.array(
    z.object({
      category: z.string(),
      files: z.array(
        z.object({
          action: z.enum(['NEW', 'MODIFY', 'DELETE']),
          file_path: z.string(),
          instructions: z.array(z.string()),
        })
      ),
    })
  ),
  verification_plan: z.object({
    automated_tests: z.array(
      z.object({
        command: z.string(),
        expected_outcome: z.string(),
      })
    ),
    manual_verification: z.array(z.string()),
  }),
});

const PhaseSchema = z.object({
  phase_number: z.number().openapi({ example: 1 }),
  phase_title: z.string().openapi({ example: 'Project Scaffolding & Configuration' }),
  description: z.string().openapi({ example: 'Initialize wrangler, bindings, secrets...' }),
  success_criteria: z.array(z.string()).optional(),
  implementation_plan: ImplementationPlanSchema.optional(),
  tasks: z.array(TaskSchema),
});

const ProjectIngestPayloadSchema = z.object({
  project_name: z.string().openapi({ example: 'MindHive' }),
  generated_date: z.string().datetime().openapi({ example: '2026-03-17T18:56:29Z' }),
  total_phases: z.number().openapi({ example: 6 }),
  phases: z.array(PhaseSchema),
});

// ============================================================================
// Route Definitions
// ============================================================================

const ingestProjectRoute = createRoute({
  method: 'post',
  path: '/api/v1/projects/ingest',
  description: 'Ingests a fully generated Agent workflow JSON and maps it relationally into D1.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProjectIngestPayloadSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            projectId: z.string().openapi({ example: 'uuid-string' }),
            message: z.string().openapi({ example: 'Project ingested via D1 batch successfully.' }),
          }),
        },
      },
      description: 'Project securely ingested and relational schema populated.',
    },
    500: {
      description: 'Internal Database Error',
    },
  },
});

// ============================================================================
// Handlers
// ============================================================================

app.openapi(ingestProjectRoute, async (c) => {
  const payload = c.req.valid('json');
  const db = drizzle(c.env.DB, { schema });

  // Pre-generate the master project ID
  const projectId = crypto.randomUUID();

  // Drizzle D1 batch queries array
  // We type it loosely as any[] to allow heterogeneous insert builder stacking
  const batchQueries: any[] = [];

  // 1. Queue Project Insert
  batchQueries.push(
    db.insert(schema.projects).values({
      id: projectId,
      name: payload.project_name,
      generatedDate: new Date(payload.generated_date),
      totalPhases: payload.total_phases,
    })
  );

  // 2. Iterate and Queue Epics (Phases)
  for (const phase of payload.phases) {
    const epicId = crypto.randomUUID();
    batchQueries.push(
      db.insert(schema.epics).values({
        id: epicId,
        projectId: projectId,
        epicNumber: phase.phase_number,
        title: phase.phase_title,
        description: phase.description,
        successCriteria: phase.success_criteria || [],
        implementationPlan: phase.implementation_plan,
      })
    );

    // 3. Iterate and Queue Stories (Tasks)
    for (const task of phase.tasks) {
      const storyId = crypto.randomUUID();
      batchQueries.push(
        db.insert(schema.stories).values({
          id: storyId,
          projectId: projectId,
          epicId: epicId,
          storyNumber: task.task_number,
          status: task.status,
          agentAssigned: task.agent_assigned,
          title: task.task_title,
          description: task.task_description,
          dependencies: task.task_dependencies || [],
          cloudflareDocsQueries: task.cloudflare_docs_queries || [],
          requirements: task.requirements || [],
          successCriteria: task.success_criteria || [],
        })
      );

      // 4. Iterate and Queue Steps
      for (const step of task.steps) {
        batchQueries.push(
          db.insert(schema.steps).values({
            id: crypto.randomUUID(),
            projectId: projectId,
            storyId: storyId,
            stepNumber: step.number,
            title: step.title,
            status: step.status,
            technicalRequirements: step.technical_requirements || [],
            successCriteria: step.success_criteria || [],
          })
        );
      }
    }
  }

  // Execute entire structural tree insertion in a single D1 transaction batch
  await db.batch(batchQueries as [any, ...any[]]);

  return c.json(
    {
      success: true,
      projectId,
      message: `Project ${payload.project_name} successfully ingested with ${batchQueries.length} relational DB operations.`,
    },
    201
  );
});

// ============================================================================
// OpenAPI Generation & Viewers Setup
// ============================================================================

app.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'MindHive API',
    description: 'Relational mapping endpoints for AI generated project payloads.',
  },
});

app.get('/swagger', swaggerUI({ url: '/openapi.json' }));

app.get(
  '/scalar',
  apiReference({
    spec: { url: '/openapi.json' },
    theme: 'kepler',
    layout: 'modern',
  })
);

export default app;
