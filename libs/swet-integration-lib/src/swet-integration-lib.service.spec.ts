import { Test, TestingModule } from '@nestjs/testing';
import { SwetIntegrationLibService } from './swet-integration-lib.service.js';

describe('SwetIntegrationLibService', () => {
  let service: SwetIntegrationLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwetIntegrationLibService],
    }).compile();

    service = module.get<SwetIntegrationLibService>(SwetIntegrationLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
