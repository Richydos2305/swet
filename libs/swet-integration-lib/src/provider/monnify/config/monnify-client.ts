import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  onHttpStatus,
  retryOn,
  withRetry,
} from '../../../core/http/retry-policy';
import { TypedHttpClient } from '../../../core/http/typed-http-client';
import { MonnifyAuthTokenService } from './monnify-auth-token.service';
import { MonnifyConfig } from './monnify.config';

@Injectable()
export class MonnifyClient extends TypedHttpClient {
  constructor(
    monnifyConfig: MonnifyConfig,
    private readonly authTokenService: MonnifyAuthTokenService,
  ) {
    super({ baseURL: monnifyConfig.baseUrl, timeout: 30_000 });
  }

  override post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.postWithCachedToken<TRequest, TResponse>(url, data, config);
  }

  private async postWithCachedToken<TRequest, TResponse>(
    url: string,
    data: TRequest | undefined,
    config: AxiosRequestConfig | undefined,
  ): Promise<AxiosResponse<TResponse>> {
    let token = await this.authTokenService.getAccessToken();
    return withRetry(
      async (attempt) => {
        if (attempt > 0) {
          token = await this.authTokenService.refreshAccessToken();
        }
        return super.post<TRequest, TResponse>(url, data, {
          ...config,
          headers: { Authorization: `Bearer ${token}`, ...config?.headers },
        });
      },
      retryOn(onHttpStatus(401)),
    );
  }
}
