import { Injectable, Logger } from '@nestjs/common';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import { ProviderHandlerRegistry } from '@swet/common/core/provider/provider-handler.registry';
import { NotificationChannel } from '../../core/notification-channel.enum';
import { NotificationRequest } from '../../core/notification-request.dto';
import { NotificationConfig } from '../config/notification.config';
import { NotificationResult } from '../provider/notification-result';
import { TemplateService } from '../template/util/template.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationConfig: NotificationConfig,
    private readonly registry: ProviderHandlerRegistry,
    private readonly templateService: TemplateService,
  ) {}

  async dispatch(request: NotificationRequest): Promise<void> {
    switch (request.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmail(request);
        return;
      case NotificationChannel.SMS:
        this.logger.warn('SMS channel requested but not implemented');
        return;
    }
  }

  private async sendEmail(request: NotificationRequest): Promise<void> {
    request.html = request.rawBody
      ? request.rawBody
      : this.templateService.render(
          request.templateName ?? '',
          request.templateContext ?? {},
        );

    const handler = this.registry.getHandler<
      IProviderHandler<NotificationRequest, NotificationResult>
    >(this.notificationConfig.emailProvider, NotificationChannel.EMAIL);

    const result = await handler.process(request);

    this.logger.log(`Email to ${request.recipient}: ${result.status}`);
  }
}
