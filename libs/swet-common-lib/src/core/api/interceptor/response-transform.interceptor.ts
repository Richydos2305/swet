import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DEFAULT_RESPONSE_MESSAGE } from '@swet/common/constant/system-constant';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_DECORATOR_KEY } from '../decorator/response-message.decorator';
import { SKIP_RESPONSE_TRANSFORM } from '../decorator/skip-response-transform.decorator';
import { ApiResponse } from '../interface/api-response.interface';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T | null>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T | null>> {
    const skipResponseTransform = this.reflector.get<boolean>(
      SKIP_RESPONSE_TRANSFORM,
      context.getHandler(),
    );

    if (skipResponseTransform) {
      return next.handle() as Observable<ApiResponse<T | null>>;
    }

    const customMessage =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_DECORATOR_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? DEFAULT_RESPONSE_MESSAGE;

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message: customMessage,
        data: data ?? null,
        errors: null,
      })),
    );
  }
}
