import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerConfig } from '@swet/common/config/logging.config';
import { SecurityConfig } from '@swet/common/config/security.config';
import { ServiceConfig } from '@swet/common/config/service.config';
import { SwaggerConfig } from '@swet/common/config/swagger.config';
import { DatabaseConfig } from '@swet/common/core/database/database.config';
import { createWinstonLogger } from '@swet/common/core/logger/winston-logger';
import { SwaggerService } from '@swet/common/core/swagger/swagger.service';
import { SwetServiceModule } from './swet-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SwetServiceModule, {
    bufferLogs: true,
  });

  app.enableShutdownHooks();

  const serviceConfig = app.get(ServiceConfig);
  const securityConfig = app.get(SecurityConfig);
  const loggerConfig = app.get(LoggerConfig);

  app.useLogger(
    createWinstonLogger(serviceConfig.name ?? 'swet-service', loggerConfig),
  );

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
