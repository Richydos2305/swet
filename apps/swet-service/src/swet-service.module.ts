import { Module } from '@nestjs/common';
import { SwetServiceController } from './swet-service.controller.js';
import { SwetServiceService } from './swet-service.service.js';

@Module({
  imports: [],
  controllers: [SwetServiceController],
  providers: [SwetServiceService],
})
export class SwetServiceModule {}
