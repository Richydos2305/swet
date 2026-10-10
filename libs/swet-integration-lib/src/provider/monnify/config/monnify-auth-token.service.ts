import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { HttpClient, InjectHttpClient } from '@nestjs/http-client';
import { IntegrationApiError } from '@swet/integration/core/api/integration-api.error';
import { IdentityProvider } from '@swet/integration/identity/identity.constant';
import type { Cache } from 'cache-manager';
import { MonnifyLoginResponse } from '../dto/monnify-login-response.dto';
import { MonnifyConfig } from './monnify.config';

@Injectable()
export class MonnifyAuthTokenService {
  constructor(
    private readonly monnifyConfig: MonnifyConfig,
    @InjectHttpClient(MonnifyConfig.AUTH_HTTP_CLIENT)
    private readonly httpClient: HttpClient,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async getAccessToken(): Promise<string> {
    const cachedToken = await this.cache.get<string>(
      MonnifyConfig.MONNIFY_ACCESS_TOKEN_CACHE_KEY,
    );

    if (cachedToken) return cachedToken;

    return this.fetchAndCacheAccessToken();
  }

  async refreshAccessToken(): Promise<string> {
    await this.cache.del(MonnifyConfig.MONNIFY_ACCESS_TOKEN_CACHE_KEY);

    return this.fetchAndCacheAccessToken();
  }

  private async fetchAndCacheAccessToken(): Promise<string> {
    try {
      const basicAuth = Buffer.from(
        `${this.monnifyConfig.apiKey}:${this.monnifyConfig.secretKey}`,
      ).toString('base64');

      const { data } = await this.httpClient.post<MonnifyLoginResponse>(
        MonnifyConfig.LOGIN_URL,
        {
          headers: { Authorization: `Basic ${basicAuth}` },
          context: {
            logger: MonnifyAuthTokenService.name,
            redactResponseBody: (body: unknown) => ({
              authenticationSuccessful:
                (body as { requestSuccessful?: boolean } | undefined)
                  ?.requestSuccessful ?? false,
            }),
          },
        },
      );

      const { accessToken, expiresIn } = data.responseBody;
      const ttlSeconds = Math.max(
        expiresIn -
          MonnifyConfig.MONNIFY_ACCESS_TOKEN_EXPIRY_SAFETY_MARGIN_SECONDS,
        0,
      );
      await this.cache.set(
        MonnifyConfig.MONNIFY_ACCESS_TOKEN_CACHE_KEY,
        accessToken,
        ttlSeconds * 1000,
      );
      return accessToken;
    } catch (error) {
      throw IntegrationApiError.fromUnknown(
        IdentityProvider.MONNIFY,
        'LOGIN',
        error,
      );
    }
  }
}
