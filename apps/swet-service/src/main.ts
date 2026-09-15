import { NestFactory } from '@nestjs/core';
import { SwetServiceModule } from './swet-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(SwetServiceModule);
  await app.listen(process.env.port ?? 3000);
}
await bootstrap();
