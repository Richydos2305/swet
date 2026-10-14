import { Injectable } from '@nestjs/common';
import { ProviderHandler } from '@swet/common/core/provider/provider-handler.decorator';
import { IProviderHandler } from '@swet/common/core/provider/provider-handler.interface';
import { NotificationChannel } from '../../../core/notification-channel.enum';
import { NotificationRequest } from '../../../core/notification-request.dto';
import { EmailProvider } from '../../config/email-provider.enum';
import { NotificationApiError } from '../notification-api.error';
import {
  NotificationResult,
  NotificationResultStatus,
} from '../notification-result';
import { MailjetClient } from './mailjet-client';
import {
  MailjetSendRequest,
  MailjetSendResponse,
} from './mailjet-send-request.dto';
import { MailjetConfig } from './mailjet.config';

@Injectable()
@ProviderHandler({
  provider: EmailProvider.MAILJET,
  service: NotificationChannel.EMAIL,
})
export class MailjetEmailHandler implements IProviderHandler<
  NotificationRequest,
  NotificationResult
> {
  constructor(
    private readonly mailjetConfig: MailjetConfig,
    private readonly mailjetClient: MailjetClient,
  ) {}

  async process(request: NotificationRequest): Promise<NotificationResult> {
    try {
      const body: MailjetSendRequest = {
        Messages: [
          {
            From: {
              Email: this.mailjetConfig.fromEmail,
              Name: this.mailjetConfig.fromName,
            },
            To: [{ Email: request.recipient }],
            Subject: request.subject,
            HTMLPart: request.html ?? '',
          },
        ],
        SandboxMode: this.mailjetConfig.sandboxMode,
      };

      const { data } = await this.mailjetClient
        .post<MailjetSendRequest, MailjetSendResponse>(
          MailjetConfig.SEND_URL,
          body,
          {
            context: {
              redactRequestBody: (requestBody: unknown) => {
                const { Messages, ...rest } = requestBody as MailjetSendRequest;
                return {
                  ...rest,
                  Messages: Messages.map((message) => ({
                    ...message,
                    HTMLPart: '[REDACTED]',
                  })),
                };
              },
            },
          },
        )
        .catch((error: unknown) => {
          throw NotificationApiError.fromUnknown(
            EmailProvider.MAILJET,
            NotificationChannel.EMAIL,
            error,
          );
        });

      return {
        status: NotificationResultStatus.COMPLETED,
        message: data.Messages?.[0]?.Status,
      };
    } catch (error) {
      return {
        status: NotificationResultStatus.FAILED,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
