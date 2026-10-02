import { AxiosError } from 'axios';

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
    if (!(error instanceof AxiosError)) return error;

    return new IntegrationApiError(
      provider,
      service,
      error.response?.data?.responseMessage ?? error.message,
      error.response?.status,
      error.response?.data?.responseCode,
    );
  }
}
