import { drizzle } from 'drizzle-orm/d1';
import { projects, epics, stories, steps } from '@db/schemas/project_tasks';

export async function checkDbHealth(db: D1Database) {
  try {
    const d1 = drizzle(db);
    // Check connectivity and existence of tables
    await d1.select().from(projects).limit(1);
    await d1.select().from(epics).limit(1);
    await d1.select().from(stories).limit(1);
    await d1.select().from(steps).limit(1);

    return {
      status: 'healthy' as const,
      details: {
        projects: 'accessible',
        epics: 'accessible',
        stories: 'accessible',
        steps: 'accessible',
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown DB health check error';
    return {
      status: 'unhealthy' as const,
      error: message,
    };
  }
}
