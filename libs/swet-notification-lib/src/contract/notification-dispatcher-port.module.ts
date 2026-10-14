import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationConfig } from '../processing/config/notification.config';
import { NOTIFICATION_DISPATCHER } from './notification-dispatcher.interface';
import { NotificationDispatcher } from './notification-dispatcher.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NotificationConfig.CLIENT,
        useFactory: (config: NotificationConfig) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.rabbitmqUrl],
            queue: config.queueName,
            queueOptions: { durable: true },
          },
        }),
        inject: [NotificationConfig],
      },
    ]),
  ],
  providers: [
    NotificationDispatcher,
    { provide: NOTIFICATION_DISPATCHER, useExisting: NotificationDispatcher },
  ],
  exports: [NOTIFICATION_DISPATCHER, NotificationDispatcher],
})
export class NotificationDispatcherPortModule {}
