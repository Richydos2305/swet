import { join } from 'path';
import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { NotificationProcessingModule } from '@swet/notification/processing/notification-processing.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({
      configFilePath: [
        join(
          process.cwd(),
          'apps/swet-notification-service/swet-notification-production.yml',
        ),
        join(
          process.cwd(),
          'apps/swet-notification-service/swet-notification-staging.yml',
        ),
        join(
          process.cwd(),
          'apps/swet-notification-service/swet-notification-dev.yml',
        ),
      ],
    }),
    NotificationProcessingModule,
  ],
})
export class SwetNotificationServiceModule {}
