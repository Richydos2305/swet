import { NotificationChannel } from './notification-channel.enum';

export class NotificationRequest {
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  templateName?: string;
  templateContext?: Record<string, unknown>;
  rawBody?: string;
  html?: string;
}
