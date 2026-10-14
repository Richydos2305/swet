import { Injectable } from '@nestjs/common';
import {
  HttpClient,
  HttpRequestOptions,
  InjectHttpClient,
} from '@nestjs/http-client';
import { MailjetConfig } from './mailjet.config';

@Injectable()
export class MailjetClient {
  constructor(
    @InjectHttpClient(MailjetConfig.HTTP_CLIENT)
    private readonly httpClient: HttpClient,
  ) {}

  post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: Omit<HttpRequestOptions, 'method'>,
  ) {
    return this.httpClient.post<TResponse>(url, {
      json: data,
      ...config,
      context: { logger: MailjetClient.name, ...config?.context },
    });
  }
}
