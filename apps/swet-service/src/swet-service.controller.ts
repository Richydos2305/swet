import { Controller, Get } from '@nestjs/common';
import { SwetServiceService } from './swet-service.service.js';

@Controller()
export class SwetServiceController {
  constructor(private readonly swetServiceService: SwetServiceService) {}

  @Get()
  getHello(): string {
    return this.swetServiceService.getHello();
  }
}
