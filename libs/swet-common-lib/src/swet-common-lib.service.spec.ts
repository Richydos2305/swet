import { Test, TestingModule } from '@nestjs/testing';
import { SwetCommonLibService } from './swet-common-lib.service';

describe('SwetCommonLibService', () => {
  let service: SwetCommonLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwetCommonLibService],
    }).compile();

    service = module.get<SwetCommonLibService>(SwetCommonLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
