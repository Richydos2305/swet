import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  // TODO: integrate email provider
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.logger.log(
      `[stub email] to=${to} subject="${subject}" body="${body}"`,
    );
    return Promise.resolve();
  }
}
