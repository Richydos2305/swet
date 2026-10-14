import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ServiceConfig } from '@swet/common/config/service.config';
import { CacheProvider } from './cache-provider.enum';

const CACHE_NAMESPACE = 'swet';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function buildCacheStore(serviceConfig: ServiceConfig): Keyv {
  if (serviceConfig.cacheProvider === CacheProvider.MEMORY) {
    return new Keyv({ ttl: CACHE_TTL_MS, namespace: CACHE_NAMESPACE });
  }

  return new Keyv({
    store: new KeyvRedis(serviceConfig.redisUrl, {
      connectionTimeout: 2500,
      throwOnErrors: false,
      keyPrefixSeparator: ':',
    }),
    ttl: CACHE_TTL_MS,
    namespace: CACHE_NAMESPACE,
    useKeyPrefix: false,
  });
}

@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ServiceConfig],
      useFactory: (serviceConfig: ServiceConfig) => ({
        stores: buildCacheStore(serviceConfig),
      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class AppCacheModule {}
