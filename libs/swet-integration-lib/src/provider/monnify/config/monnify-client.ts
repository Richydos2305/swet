import { Injectable } from '@nestjs/common';
import {
  HttpClient,
  HttpRequestOptions,
  InjectHttpClient,
} from '@nestjs/http-client';
import { MonnifyConfig } from './monnify.config';

@Injectable()
export class MonnifyClient {
  constructor(
    @InjectHttpClient(MonnifyConfig.HTTP_CLIENT)
    private readonly httpClient: HttpClient,
  ) {}

  post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: Omit<HttpRequestOptions, 'method'>,
  ) {
    return this.httpClient.post<TResponse>(url, {
      json: data,
      retry: { methods: ['POST'], statusCodes: [401], attempts: 2 },
      ...config,
      context: { logger: MonnifyClient.name, ...config?.context },
    });
  }
}
