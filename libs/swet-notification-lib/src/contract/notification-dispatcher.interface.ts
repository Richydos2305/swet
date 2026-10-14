export class DispatchEmailContent {
  templateName?: string;
  templateContext?: Record<string, unknown>;
  rawBody?: string;
  /** Message expiry time, in seconds. Omit for mail with no expiry. */
  ttlSeconds?: number;
}

export interface INotificationDispatcher {
  dispatchEmail(
    recipient: string,
    subject: string,
    content: DispatchEmailContent,
  ): void;
}

export const NOTIFICATION_DISPATCHER = Symbol('SWET_NOTIFICATION_DISPATCHER');
