import { Module } from '@nestjs/common';
import { SwetIntegrationLibService } from './swet-integration-lib.service.js';

@Module({
  providers: [SwetIntegrationLibService],
  exports: [SwetIntegrationLibService],
})
export class SwetIntegrationLibModule {}
