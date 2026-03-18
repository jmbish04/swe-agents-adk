import { describe, it, expect, vi } from 'vitest';
import { checkHealth } from './index';

describe('Health Service', () => {
  it('should report healthy when all services are up', async () => {
    const mockEnv = {
      DB: {},
      AI: {
        run: vi.fn().mockResolvedValue({ response: 'healthy' })
      },
      PM_AGENT: {},
      UX_AGENT: {},
      PYTHON_AGENT: {},
      APPS_AGENT: {},
      WORKSPACE_AGENT: {},
      CF_AGENT: {},
      GITHUB_AGENT: {},
      SPECIALTY_AGENT: {},
    };

    // Mock checkDbHealth since it needs a real D1 usually
    vi.mock('./db', () => ({
      checkDbHealth: vi.fn().mockResolvedValue({ status: 'healthy', details: {} })
    }));

    const result = await checkHealth(mockEnv as any);
    expect(result.overallStatus).toBe('healthy');
    expect(result.services.db.status).toBe('healthy');
    expect(result.services.ai.status).toBe('healthy');
    expect(result.services.agents).toHaveLength(8);
  });

  it('should report degraded when a service fails', async () => {
    const mockEnv = {
      DB: {},
      AI: {
        run: vi.fn().mockRejectedValue(new Error('AI fail'))
      },
      PM_AGENT: {},
      // ... missing some agents or they are null
    };

    const result = await checkHealth(mockEnv as any);
    expect(result.overallStatus).toBe('degraded');
    expect(result.services.ai.status).toBe('unhealthy');
  });
});
