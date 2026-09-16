import { NestFactory } from '@nestjs/core';
import { DatabaseConfig } from '@swet/common/core/database/database.config';
import { SwetServiceModule } from './swet-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SwetServiceModule);

  const databaseConfig = app.get(DatabaseConfig);

  await databaseConfig.testConnection();

  await app.listen(process.env.port ?? 5151);
}
await bootstrap();
