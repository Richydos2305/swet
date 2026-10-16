import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggerConfig } from '@swet/common/config/logging.config';
import { createWinstonLogger } from '@swet/common/core/logger/winston-logger';
import { NotificationConfig } from '@swet/notification/processing/config/notification.config';
import { SwetNotificationServiceModule } from './swet-notification-service.module.js';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    SwetNotificationServiceModule,
    { bufferLogs: true },
  );

  const notificationConfig = appContext.get(NotificationConfig);
  const loggerConfig = appContext.get(LoggerConfig);
  const logger = createWinstonLogger('swet-notification', loggerConfig);

  appContext.useLogger(logger);

  await appContext.close();

  const app = await NestFactory.createMicroservice(
    SwetNotificationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [notificationConfig.rabbitmqUrl],
        queue: notificationConfig.queueName,
        queueOptions: { durable: true },
        noAck: false,
      },
      bufferLogs: true,
    },
  );

  app.useLogger(logger);

  app.enableShutdownHooks();

  await app.listen();
}

await bootstrap();
