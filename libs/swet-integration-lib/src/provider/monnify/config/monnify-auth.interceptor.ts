import { Injectable } from '@nestjs/common';
import type {
  HttpClientInterceptor,
  HttpHandler,
  HttpRequest,
} from '@nestjs/http-client';
import { MonnifyAuthTokenService } from './monnify-auth-token.service';

@Injectable()
export class MonnifyAuthInterceptor implements HttpClientInterceptor {
  constructor(
    private readonly monnifyAuthTokenService: MonnifyAuthTokenService,
  ) {}

  async intercept(request: HttpRequest, next: HttpHandler): Promise<Response> {
    const token =
      request.attempt === 1
        ? await this.monnifyAuthTokenService.getAccessToken()
        : await this.monnifyAuthTokenService.refreshAccessToken();

    request.headers.set('Authorization', `Bearer ${token}`);

    return next(request);
  }
}
