import { IntegrationResponseStatus } from '@swet/integration/core/api/integration-response';
import { MockNinHandler } from '@swet/integration/identity/mock/mock-nin.handler';

describe('MockNinHandler', () => {
  const handler = new MockNinHandler();

  it('returns a deterministic verified identity for a valid nin', async () => {
    const first = await handler.process({ nin: '12345678901' });
    const second = await handler.process({ nin: '12345678901' });

    expect(first.status).toBe(IntegrationResponseStatus.COMPLETED);
    expect(first.data).toMatchObject({
      nin: '12345678901',
      isVerified: true,
    });
    expect(second.data).toEqual(first.data);
  });

  it('returns COMPLETED_WITH_ERROR for a nin ending in 0000', async () => {
    const result = await handler.process({ nin: '12345670000' });

    expect(result.status).toBe(IntegrationResponseStatus.COMPLETED_WITH_ERROR);
    expect(result.data).toBeUndefined();
  });
});
