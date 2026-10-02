import { DiscoveryModule } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ProviderHandlerExplorer } from '@swet/common/core/provider/provider-handler.explorer';
import { ProviderHandlerRegistry } from '@swet/common/core/provider/provider-handler.registry';

describe('ProviderHandlerExplorer', () => {
  it('registers a decorated handler at module init', async () => {
    const module = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [ProviderHandlerRegistry, ProviderHandlerExplorer],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const registry = module.get(ProviderHandlerRegistry);
    expect(registry.hasHandler('DUMMY_PROVIDER', 'DUMMY_SERVICE')).toBe(true);

    await app.close();
  });
});
