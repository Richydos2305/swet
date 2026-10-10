import { Module } from '@nestjs/common';
import { HttpClientModule } from '@nestjs/http-client';
import { ProviderModule } from '@swet/common/core/provider/provider.module';
import { RabbitmqListener } from './listener/rabbitmq.listener';
import { HttpClientLogInterceptor } from './provider/http-client-log.interceptor';
import { MailjetClient } from './provider/mailjet/mailjet-client';
import { MailjetEmailHandler } from './provider/mailjet/mailjet-email.handler';
import { MailjetConfig } from './provider/mailjet/mailjet.config';
import { NotificationService } from './service/notification.service';
import { TemplateService } from './template/util/template.service';

@Module({
  imports: [
    HttpClientModule.registerAsync({
      name: MailjetConfig.HTTP_CLIENT,
      interceptors: [HttpClientLogInterceptor],
      useFactory: (config: MailjetConfig) => ({
        baseUrl: config.baseUrl,
        timeout: 30_000,
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${config.apiKey}:${config.apiSecret}`,
          ).toString('base64')}`,
        },
      }),
      inject: [MailjetConfig],
    }),
    ProviderModule,
  ],
  controllers: [RabbitmqListener],
  providers: [
    HttpClientLogInterceptor,
    MailjetClient,
    MailjetEmailHandler,
    TemplateService,
    NotificationService,
  ],
})
export class NotificationProcessingModule {}
