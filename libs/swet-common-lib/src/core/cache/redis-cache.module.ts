import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ServiceConfig } from '@swet/common/config/service.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ServiceConfig],
      useFactory: (serviceConfig: ServiceConfig) => ({
        stores: new Keyv({
          store: new KeyvRedis(serviceConfig.redisUrl, {
            connectionTimeout: 2500,
            throwOnErrors: false,
            keyPrefixSeparator: ':',
          }),
          ttl: 60 * 60 * 1000, // 1 hour
          namespace: 'swet',
          useKeyPrefix: false,
        }),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
