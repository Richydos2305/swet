import { Controller, Logger } from '@nestjs/common';
import type { RmqContext } from '@nestjs/microservices';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NotificationRequest } from '@swet/notification/core/notification-request.dto';
import { NotificationConfig } from '../config/notification.config';
import { NotificationService } from '../service/notification.service';

@Controller()
export class RabbitmqListener {
  private readonly logger = new Logger(RabbitmqListener.name);

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern<string>(NotificationConfig.PATTERN)
  async handleNotification(
    @Payload() request: NotificationRequest,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.notificationService.dispatch(request);
    } catch (error) {
      this.logger.error(
        `Failed to process notification for ${request.recipient}`,
        error instanceof Error ? error.stack : undefined,
      );
    } finally {
      context.getChannelRef().ack(context.getMessage());
    }
  }
}
