import { Injectable, Logger } from '@nestjs/common';
import type {
  HttpClientInterceptor,
  HttpHandler,
  HttpRequest,
} from '@nestjs/http-client';

export interface HttpClientLogContext {
  logger?: string;
  redactRequestBody?: (body: unknown) => unknown;
  redactResponseBody?: (body: unknown) => unknown;
}

@Injectable()
export class HttpClientLogInterceptor implements HttpClientInterceptor {
  async intercept(request: HttpRequest, next: HttpHandler): Promise<Response> {
    const {
      logger: loggerName,
      redactRequestBody,
      redactResponseBody,
    } = (request.context as HttpClientLogContext | undefined) ?? {};

    const logger = new Logger(loggerName ?? HttpClientLogInterceptor.name);

    const target = `${request.url.origin}${request.url.pathname}`;

    logger.log(
      `Request [${request.method}] ${target} : ${this.describeRequestBody(request.body, redactRequestBody)}`,
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

  private describeRequestBody(
    body: HttpRequest['body'],
    redact?: (body: unknown) => unknown,
  ): string {
    if (typeof body !== 'string') {
      return JSON.stringify((redact ? redact(body) : body) ?? {});
    }

    if (!redact) return body;

    try {
      return JSON.stringify(redact(JSON.parse(body)));
    } catch {
      return body;
    }
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
