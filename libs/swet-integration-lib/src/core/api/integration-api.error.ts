import {
  HttpNetworkError,
  HttpResponseError,
  HttpTimeoutError,
} from '@nestjs/http-client';

export class IntegrationApiError extends Error {
  constructor(
    public readonly provider: string,
    public readonly service: string,
    message: string,
    public readonly statusCode?: number,
    public readonly providerResponseCode?: string,
  ) {
    super(message);
    this.name = 'IntegrationApiError';
  }

  static fromUnknown(
    provider: string,
    service: string,
    error: unknown,
  ): unknown {
    if (error instanceof HttpResponseError) {
      const body = error.body as
        { responseMessage?: string; responseCode?: string } | undefined;

      return new IntegrationApiError(
        provider,
        service,
        body?.responseMessage ?? error.message,
        error.status,
        body?.responseCode,
      );
    }

    if (
      error instanceof HttpTimeoutError ||
      error instanceof HttpNetworkError
    ) {
      return new IntegrationApiError(provider, service, error.message);
    }

    return error;
  }
}
