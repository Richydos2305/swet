import {
  HttpNetworkError,
  HttpResponseError,
  HttpTimeoutError,
} from '@nestjs/http-client';
import { IntegrationApiError } from '@swet/integration/core/api/integration-api.error';

describe('IntegrationApiError.fromUnknown', () => {
  it('maps an HttpResponseError using the provider response envelope', () => {
    const error = new HttpResponseError({
      method: 'POST',
      url: 'https://sandbox.monnify.com/api/v1/vas/bvn-details-match',
      status: 401,
      body: { responseMessage: 'Invalid or expired token', responseCode: '99' },
    });

    const result = IntegrationApiError.fromUnknown('MONNIFY', 'BVN', error);

    expect(result).toBeInstanceOf(IntegrationApiError);
    expect(result).toMatchObject({
      provider: 'MONNIFY',
      service: 'BVN',
      message: 'Invalid or expired token',
      statusCode: 401,
      providerResponseCode: '99',
    });
  });

  it('falls back to the error message when the body has no responseMessage', () => {
    const error = new HttpResponseError({
      method: 'POST',
      url: 'https://sandbox.monnify.com/api/v1/vas/nin-details',
      status: 500,
    });

    const result = IntegrationApiError.fromUnknown('MONNIFY', 'NIN', error);

    expect(result).toBeInstanceOf(IntegrationApiError);
    expect((result as IntegrationApiError).message).toBe(error.message);
    expect((result as IntegrationApiError).statusCode).toBe(500);
  });

  it('maps an HttpTimeoutError', () => {
    const error = new HttpTimeoutError({
      method: 'POST',
      url: 'https://sandbox.monnify.com/api/v1/auth/login',
      timeoutMs: 30_000,
    });

    const result = IntegrationApiError.fromUnknown('MONNIFY', 'LOGIN', error);

    expect(result).toBeInstanceOf(IntegrationApiError);
    expect((result as IntegrationApiError).message).toBe(error.message);
  });

  it('maps an HttpNetworkError', () => {
    const error = new HttpNetworkError({
      method: 'POST',
      url: 'https://sandbox.monnify.com/api/v1/auth/login',
      cause: new Error('ECONNREFUSED'),
    });

    const result = IntegrationApiError.fromUnknown('MONNIFY', 'LOGIN', error);

    expect(result).toBeInstanceOf(IntegrationApiError);
    expect((result as IntegrationApiError).message).toBe(error.message);
  });

  it('passes through anything else unchanged', () => {
    const error = new Error('unexpected');

    expect(IntegrationApiError.fromUnknown('MONNIFY', 'BVN', error)).toBe(
      error,
    );
  });
});
