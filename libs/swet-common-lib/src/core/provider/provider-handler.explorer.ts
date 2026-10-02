import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PROVIDER_HANDLER_METADATA_KEY } from './provider-handler.constant';
import { ProviderHandlerMetadata } from './provider-handler.decorator';
import { IProviderHandler } from './provider-handler.interface';
import { ProviderHandlerRegistry } from './provider-handler.registry';

@Injectable()
export class ProviderHandlerExplorer implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly registry: ProviderHandlerRegistry,
  ) {}

  onModuleInit(): void {
    for (const wrapper of this.discoveryService.getProviders()) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) {
        continue;
      }

      const metadata = this.reflector.get<ProviderHandlerMetadata | undefined>(
        PROVIDER_HANDLER_METADATA_KEY,
        metatype,
      );
      if (metadata) {
        this.registry.registerHandler(
          metadata.provider,
          metadata.service,
          instance as IProviderHandler,
        );
      }
    }
  }
}
