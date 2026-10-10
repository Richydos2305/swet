import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NotificationConfig } from '@swet/notification/processing/config/notification.config';
import { SwetNotificationServiceModule } from './swet-notification-service.module.js';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    SwetNotificationServiceModule,
  );

  const notificationConfig = appContext.get(NotificationConfig);

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
    },
  );

  app.enableShutdownHooks();

  await app.listen();
}

await bootstrap();
