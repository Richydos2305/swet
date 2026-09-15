import { Test, TestingModule } from '@nestjs/testing';
import { SwetServiceController } from './swet-service.controller.js';
import { SwetServiceService } from './swet-service.service.js';

describe('SwetServiceController', () => {
  let swetServiceController: SwetServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SwetServiceController],
      providers: [SwetServiceService],
    }).compile();

    swetServiceController = app.get<SwetServiceController>(
      SwetServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(swetServiceController.getHello()).toBe('Hello World!');
    });
  });
});
