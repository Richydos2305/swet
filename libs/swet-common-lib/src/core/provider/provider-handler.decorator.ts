import { SetMetadata } from '@nestjs/common';
import { PROVIDER_HANDLER_METADATA_KEY } from './provider-handler.constant';

export interface ProviderHandlerMetadata {
  provider: string;
  service: string;
}

export const ProviderHandler = (metadata: ProviderHandlerMetadata) =>
  SetMetadata(PROVIDER_HANDLER_METADATA_KEY, metadata);
