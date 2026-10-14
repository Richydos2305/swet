import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ProviderHandlerExplorer } from './provider-handler.explorer';
import { ProviderHandlerRegistry } from './provider-handler.registry';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [ProviderHandlerRegistry, ProviderHandlerExplorer],
  exports: [ProviderHandlerRegistry],
})
export class ProviderModule {}
