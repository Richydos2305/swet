import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  IApiErrorResponse,
  IErrorDetail,
} from '../interface/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let details: IErrorDetail[];
    let errorLabel: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = this.extractErrorMessage(exceptionResponse, status);
      errorLabel = this.getErrorLabel(status);
      details = this.extractDetails(exceptionResponse, message);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.getFriendlyMessage(status);
      errorLabel = this.getErrorLabel(status);
      details = [{ message: 'Internal server error' }];
    }

    this.logException(exception, status, message);

    const errorResponse: IApiErrorResponse = {
      success: false,
      message,
      data: null,
      errors: {
        statusCode: status,
        error: errorLabel,
        apiPath: request.url,
        timestamp: new Date().toISOString(),
        details,
      },
    };

    return response.status(status).json(errorResponse);
  }

  private extractDetails(
    exceptionResponse: any,
    fallbackMessage: string,
  ): IErrorDetail[] {
    if (typeof exceptionResponse === 'string') {
      return [{ message: exceptionResponse }];
    }

    if (typeof exceptionResponse !== 'object' || exceptionResponse === null) {
      return [{ message: fallbackMessage }];
    }

    const resp = exceptionResponse as Record<string, unknown>;
    const msg = resp.message;

    if (Array.isArray(msg)) {
      return msg.map((m) => ({ message: String(m) }));
    }

    if (typeof msg === 'string') {
      return [{ message: msg }];
    }

    return [{ message: fallbackMessage }];
  }

  private extractErrorMessage(exceptionResponse: any, status: number): string {
    if (status >= 500 || status === 429) return this.getFriendlyMessage(status);

    if (
      exceptionResponse !== null &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as Record<string, unknown>).message;
      if (typeof message === 'string') return message;
    }

    return this.getFriendlyMessage(status);
  }

  private getErrorLabel(status: number): string {
    return ERROR_LABELS[status] || 'Error';
  }

  private getFriendlyMessage(status: number): string {
    return (
      FRIENDLY_MESSAGES[status] ||
      'An unexpected error occurred. Please try again'
    );
  }

  private logException(exception: unknown, status: number, message: string) {
    if (status >= 500) {
      this.logger.error(exception);
      return;
    }

    this.logger.warn(`Request exception: ${message}`);
  }
}

const ERROR_LABELS: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  408: 'Request Timeout',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

const FRIENDLY_MESSAGES: Record<number, string> = {
  400: 'Kindly check your input and try again',
  401: 'You are not authorized to access this resource',
  403: 'Access denied. You do not have sufficient permission to perform this action',
  404: 'The requested resource was not found',
  408: 'Request timed out',
  409: 'This action conflicts with existing data',
  422: 'The data provided could not be processed',
  429: 'Too many requests. Please try again later',
  500: 'Something went wrong on our end. Kindly contact admin or hold on while we try to fix it',
  502: 'Service temporarily unavailable. Please try again later',
  503: 'Service is currently unavailable. Please try again later',
};
