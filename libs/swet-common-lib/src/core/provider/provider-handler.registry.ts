import { Injectable } from '@nestjs/common';
import { IProviderHandler } from './provider-handler.interface';
import { buildProviderHandlerKey } from './provider-handler.constant';

@Injectable()
export class ProviderHandlerRegistry {
  private readonly handlers = new Map<string, IProviderHandler>();

  registerHandler(
    provider: string,
    service: string,
    handler: IProviderHandler,
  ): void {
    this.handlers.set(buildProviderHandlerKey(provider, service), handler);
  }

  getHandler<T extends IProviderHandler>(provider: string, service: string): T {
    const handler = this.tryGetHandler<T>(provider, service);
    if (!handler) {
      throw new Error(
        `No provider handler is registered for provider "${provider}" and service "${service}"`,
      );
    }
    return handler;
  }

  tryGetHandler<T extends IProviderHandler>(
    provider: string,
    service: string,
  ): T | undefined {
    return this.handlers.get(buildProviderHandlerKey(provider, service)) as
      T | undefined;
  }

  hasHandler(provider: string, service: string): boolean {
    return this.handlers.has(buildProviderHandlerKey(provider, service));
  }
}
