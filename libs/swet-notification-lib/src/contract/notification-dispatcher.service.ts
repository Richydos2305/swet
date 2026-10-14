import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { NotificationChannel } from '../core/notification-channel.enum';
import { NotificationRequest } from '../core/notification-request.dto';
import { NotificationConfig } from '../processing/config/notification.config';
import {
  DispatchEmailContent,
  INotificationDispatcher,
} from './notification-dispatcher.interface';

@Injectable()
export class NotificationDispatcher implements INotificationDispatcher {
  constructor(
    @Inject(NotificationConfig.CLIENT)
    private readonly client: ClientProxy,
  ) {}

  dispatchEmail(
    recipient: string,
    subject: string,
    content: DispatchEmailContent,
  ): void {
    const { ttlSeconds, ...rest } = content;

    const request: NotificationRequest = {
      channel: NotificationChannel.EMAIL,
      recipient,
      subject,
      ...rest,
    };

    const payload = ttlSeconds
      ? new RmqRecordBuilder(request)
          .setOptions({ expiration: String(ttlSeconds * 1000) })
          .build()
      : request;

    this.client.emit(NotificationConfig.PATTERN, payload);
  }
}
