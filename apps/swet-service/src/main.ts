import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SecurityConfig } from '@swet/common/config/security.config';
import { ServiceConfig } from '@swet/common/config/service.config';
import { SwaggerConfig } from '@swet/common/config/swagger.config';
import { DatabaseConfig } from '@swet/common/core/database/database.config';
import { SwaggerService } from '@swet/common/core/swagger/swagger.service';
import { SwetServiceModule } from './swet-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SwetServiceModule);

  const serviceConfig = app.get(ServiceConfig);
  const securityConfig = app.get(SecurityConfig);

  app.enableCors({
    origin: securityConfig.allowedOrigins.includes('*')
      ? '*'
      : securityConfig.allowedOrigins,
    methods: securityConfig.allowedMethods,
    credentials: false,
    exposedHeaders: securityConfig.exposedHeaders,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  SwaggerService.setup(app, app.get(SwaggerConfig));

  const databaseConfig = app.get(DatabaseConfig);

  await databaseConfig.testConnection();

  await app.listen(serviceConfig.port);
}
await bootstrap();
