import {
  HttpNetworkError,
  HttpResponseError,
  HttpTimeoutError,
} from '@nestjs/http-client';

export class NotificationApiError extends Error {
  constructor(
    public readonly provider: string,
    public readonly service: string,
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'NotificationApiError';
  }

  static fromUnknown(
    provider: string,
    service: string,
    error: unknown,
  ): unknown {
    if (error instanceof HttpResponseError) {
      const body = error.body as { ErrorMessage?: string } | undefined;

      return new NotificationApiError(
        provider,
        service,
        body?.ErrorMessage ?? error.message,
        error.status,
      );
    }

    if (
      error instanceof HttpTimeoutError ||
      error instanceof HttpNetworkError
    ) {
      return new NotificationApiError(provider, service, error.message);
    }

    return error;
  }
}
