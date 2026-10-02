export const PROVIDER_HANDLER_METADATA_KEY = 'PROVIDER_HANDLER_METADATA';

export const buildProviderHandlerKey = (
  provider: string,
  service: string,
): string => `${provider}::${service}`;
