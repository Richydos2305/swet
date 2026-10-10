import { Injectable, Logger } from '@nestjs/common';
import type {
  HttpClientInterceptor,
  HttpHandler,
  HttpRequest,
} from '@nestjs/http-client';

export interface HttpClientLogContext {
  logger?: string;
  redactResponseBody?: (body: unknown) => unknown;
}

@Injectable()
export class HttpClientLogInterceptor implements HttpClientInterceptor {
  async intercept(request: HttpRequest, next: HttpHandler): Promise<Response> {
    const { logger: loggerName, redactResponseBody } =
      (request.context as HttpClientLogContext | undefined) ?? {};

    const logger = new Logger(loggerName ?? HttpClientLogInterceptor.name);

    const target = `${request.url.origin}${request.url.pathname}`;

    logger.log(
      `Request [${request.method}] ${target} : ${this.describeRequestBody(request.body)}`,
    );

    try {
      const response = await next(request);

      const body = await this.describeResponseBody(
        response,
        redactResponseBody,
      );

      logger.log(
        `Response [${request.method}] ${target} - status ${response.status} : ${JSON.stringify(body)}`,
      );
      return response;
    } catch (error) {
      logger.error(
        `Response [${request.method}] ${target} failed: ${(error as Error).name} (attempt ${request.attempt})`,
      );
      throw error;
    }
  }

  private describeRequestBody(body: HttpRequest['body']): string {
    return typeof body === 'string' ? body : JSON.stringify(body ?? {});
  }

  private async describeResponseBody(
    response: Response,
    redact?: (body: unknown) => unknown,
  ): Promise<unknown> {
    try {
      const data = await response.clone().json();
      return redact ? redact(data) : (data ?? {});
    } catch {
      return {};
    }
  }
}
