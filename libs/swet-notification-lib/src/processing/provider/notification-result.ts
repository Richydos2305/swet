export enum NotificationResultStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class NotificationResult {
  status: NotificationResultStatus;
  message?: string;
}
