import { Module } from '@nestjs/common';
import { HttpClientModule } from '@nestjs/http-client';
import { AppCacheModule } from '@swet/common/core/cache/cache.module';
import { HttpClientLogInterceptor } from '@swet/integration/core/http/http-client-log.interceptor';
import { MonnifyAuthTokenService } from '../../provider/monnify/config/monnify-auth-token.service';
import { MonnifyAuthInterceptor } from '../../provider/monnify/config/monnify-auth.interceptor';
import { MonnifyClient } from '../../provider/monnify/config/monnify-client';
import { MonnifyConfig } from '../../provider/monnify/config/monnify.config';
import { MonnifyBvnHandler } from './monnify-bvn.handler';
import { MonnifyNinHandler } from './monnify-nin.handler';

@Module({
  imports: [
    AppCacheModule,
    HttpClientModule.registerAsync({
      name: MonnifyConfig.AUTH_HTTP_CLIENT,
      interceptors: [HttpClientLogInterceptor],
      useFactory: (config: MonnifyConfig) => ({
        baseUrl: config.baseUrl,
        timeout: 30_000,
      }),
      inject: [MonnifyConfig],
    }),
    HttpClientModule.registerAsync({
      name: MonnifyConfig.HTTP_CLIENT,
      interceptors: [HttpClientLogInterceptor, MonnifyAuthInterceptor],
      useFactory: (config: MonnifyConfig) => ({
        baseUrl: config.baseUrl,
        timeout: 30_000,
      }),
      inject: [MonnifyConfig],
    }),
  ],
  providers: [
    HttpClientLogInterceptor,
    MonnifyAuthInterceptor,
    MonnifyClient,
    MonnifyAuthTokenService,
    MonnifyBvnHandler,
    MonnifyNinHandler,
  ],
})
export class MonnifyIdentityModule {}
